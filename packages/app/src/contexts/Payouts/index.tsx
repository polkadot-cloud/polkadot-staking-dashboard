// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, useContext, createContext } from 'react';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import type { AnyApi } from 'types';
import type { AnyJson, Sync } from '@w3ux/types';
import Worker from 'workers/stakers?worker';
import { setStateWithRef } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { MaxSupportedPayoutEras, defaultPayoutsContext } from './defaults';
import type {
  LocalValidatorExposure,
  PayoutsContextInterface,
  UnclaimedPayouts,
} from './types';
import {
  getLocalEraExposure,
  hasLocalEraExposure,
  setLocalEraExposure,
  setLocalUnclaimedPayouts,
} from './Utils';
import { BondedMulti } from 'model/Query/BondedMulti';
import { ApiController } from 'controllers/Api';
import { ClaimedRewards } from 'model/Query/ClaimedRewards';
import { ErasValidatorReward } from 'model/Query/ErasValidatorReward';
import { ErasRewardPoints } from 'model/Query/ErasRewardPoints';
import { ValidatorPrefs } from 'model/Query/ValidatorPrefs';
import { perbillToPercent } from 'library/Utils';

const worker = new Worker();

export const PayoutsContext = createContext<PayoutsContextInterface>(
  defaultPayoutsContext
);

export const usePayouts = () => useContext(PayoutsContext);

export const PayoutsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const { consts, activeEra } = useApi();
  const { activeAccount } = useActiveAccounts();
  const { isNominating, fetchEraStakers } = useStaking();
  const { maxExposurePageSize } = consts;

  // Store active accont's payout state.
  const [unclaimedPayouts, setUnclaimedPayouts] =
    useState<UnclaimedPayouts>(null);

  // Track whether payouts have been fetched.
  const [payoutsSynced, setPayoutsSynced] = useState<Sync>('unsynced');
  const payoutsSyncedRef = useRef(payoutsSynced);

  // Calculate eras to check for pending payouts.
  const getErasInterval = () => {
    const startEra = activeEra?.index.minus(1) || new BigNumber(1);
    const endEra = BigNumber.max(
      startEra.minus(MaxSupportedPayoutEras).plus(1),
      1
    );
    return {
      startEra,
      endEra,
    };
  };

  // Determine whether to keep processing a next era, or move onto checking for pending payouts.
  const shouldContinueProcessing = async (
    era: BigNumber,
    endEra: BigNumber
  ) => {
    // If there are more exposures to process, check next era.
    if (new BigNumber(era).isGreaterThan(endEra)) {
      checkEra(new BigNumber(era).minus(1));
    }
    // If all exposures have been processed, check for pending payouts.
    else if (new BigNumber(era).isEqualTo(endEra)) {
      await getUnclaimedPayouts();
      setStateWithRef('synced', setPayoutsSynced, payoutsSyncedRef);
    }
  };

  // Fetch exposure data for an era, and pass the data to the worker to determine the validator the
  // active account was backing in that era.
  const checkEra = async (era: BigNumber) => {
    if (!activeAccount) {
      return;
    }

    // Bypass worker if local exposure data is available.
    if (hasLocalEraExposure(network, era.toString(), activeAccount)) {
      // Continue processing eras, or move onto reward processing.
      shouldContinueProcessing(era, getErasInterval().endEra);
    } else {
      const exposures = await fetchEraStakers(era.toString());
      worker.postMessage({
        task: 'processEraForExposure',
        era: String(era),
        who: activeAccount,
        networkName: network,
        maxExposurePageSize: maxExposurePageSize.toString(),
        exitOnExposed: false,
        exposures,
      });
    }
  };

  // Handle worker message on completed exposure check.
  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      // ensure correct task received.
      const { data } = message;
      const { task } = data;
      if (task !== 'processEraForExposure') {
        return;
      }

      // Exit early if network or account conditions have changed.
      const { networkName, who } = data;
      if (networkName !== network || who !== activeAccount) {
        return;
      }
      const { era, exposedValidators } = data;
      const { endEra } = getErasInterval();

      // Store received era exposure data results in local storage.
      setLocalEraExposure(
        networkName,
        era,
        who,
        exposedValidators,
        endEra.toString()
      );

      // Continue processing eras, or move onto reward processing.
      shouldContinueProcessing(era, endEra);
    }
  };

  // Start pending payout process once exposure data is fetched.
  const getUnclaimedPayouts = async () => {
    const { pApi } = ApiController.get(network);
    if (!pApi || !activeAccount) {
      return;
    }

    // Accumulate eras to check, and determine all validator ledgers to fetch from exposures.
    const erasValidators = [];
    const { startEra, endEra } = getErasInterval();
    let erasToCheck: string[] = [];
    let currentEra = startEra;
    while (currentEra.isGreaterThanOrEqualTo(endEra)) {
      const validators = Object.keys(
        getLocalEraExposure(network, currentEra.toString(), activeAccount)
      );
      erasValidators.push(...validators);
      erasToCheck.push(currentEra.toString());
      currentEra = currentEra.minus(1);
    }

    // Ensure no validator duplicates.
    const uniqueValidators = [...new Set(erasValidators)];

    // Ensure `erasToCheck` is in order, highest first.
    erasToCheck = erasToCheck.sort((a: string, b: string) =>
      new BigNumber(b).minus(a).toNumber()
    );

    // Fetch controllers in order to query ledgers.
    const uniqueValidatorsMulti: [string][] = uniqueValidators.map((v) => [v]);
    const bondedResultsMulti = await new BondedMulti(
      pApi,
      uniqueValidatorsMulti
    ).fetch();

    const validatorControllers: Record<string, string> = {};
    for (let i = 0; i < bondedResultsMulti.length; i++) {
      const ctlr = bondedResultsMulti[i] || null;
      if (ctlr) {
        validatorControllers[uniqueValidators[i]] = ctlr;
      }
    }

    // Unclaimed rewards by validator. Record<validator, eras[]>.
    const unclaimedRewards: Record<string, string[]> = {};

    // Refer to new `ClaimedRewards` storage item and calculate unclaimed rewards from that and
    // `exposedPage` stored locally in exposure data.

    // Accumulate calls to fetch unclaimed rewards for each era for all validators.
    const unclaimedRewardsEntries = erasToCheck
      .map((era) => uniqueValidators.map((v) => [era, v]))
      .flat();

    const results = await Promise.all(
      unclaimedRewardsEntries.map(([era, v]) =>
        new ClaimedRewards(pApi, era, v).fetch()
      )
    );

    for (let i = 0; i < results.length; i++) {
      const pages = results[i] || [];
      const era = unclaimedRewardsEntries[i][0];
      const validator = unclaimedRewardsEntries[i][1];
      const exposure = getLocalEraExposure(network, era, activeAccount);
      const exposedPage =
        exposure?.[validator]?.exposedPage !== undefined
          ? Number(exposure[validator].exposedPage)
          : undefined;

      // Add to `unclaimedRewards` if payout page has not yet been claimed.
      if (!pages.includes(exposedPage)) {
        if (unclaimedRewards?.[validator]) {
          unclaimedRewards[validator].push(era);
        } else {
          unclaimedRewards[validator] = [era];
        }
      }
    }

    // Reformat unclaimed rewards to be { era: validators[] }.
    const unclaimedByEra: Record<string, string[]> = {};
    erasToCheck.forEach((era) => {
      const eraValidators: string[] = [];
      Object.entries(unclaimedRewards).forEach(([validator, eras]) => {
        if (eras.includes(era)) {
          eraValidators.push(validator);
        }
      });
      if (eraValidators.length > 0) {
        unclaimedByEra[era] = eraValidators;
      }
    });

    // Accumulate calls needed to fetch data to calculate rewards.
    const calls: AnyApi[] = [];
    Object.entries(unclaimedByEra).forEach(([era, validators]) => {
      if (validators.length > 0) {
        calls.push(
          Promise.all([
            new ErasValidatorReward(pApi, era).fetch(),
            new ErasRewardPoints(pApi, era).fetch(),
            ...validators.map((validator: AnyJson) =>
              new ValidatorPrefs(pApi, era, validator).fetch()
            ),
          ])
        );
      }
    });

    // Iterate calls and determine unclaimed payouts.
    // `unclaimed`: Record<era, Record<validator, unclaimedPayout>>.
    const unclaimed: UnclaimedPayouts = {};
    let i = 0;
    for (const [reward, eraRewardPoints, ...prefs] of await Promise.all(
      calls
    )) {
      const era = Object.keys(unclaimedByEra)[i];
      const eraTotalPayout = new BigNumber(reward.toString());
      const unclaimedValidators = unclaimedByEra[era];

      let j = 0;
      for (const pref of prefs) {
        const eraValidatorPrefs = {
          commission: pref.commission,
          blocked: pref.blocked,
        };
        const commission = new BigNumber(
          perbillToPercent(eraValidatorPrefs.commission)
        );

        // Get validator from era exposure data. Falls back no null if it cannot be found.
        const validator = unclaimedValidators?.[j] || '';

        const localExposed: LocalValidatorExposure | null = getLocalEraExposure(
          network,
          era,
          activeAccount
        )?.[validator];

        const staked = new BigNumber(localExposed?.staked || '0');
        const total = new BigNumber(localExposed?.total || '0');
        const isValidator = localExposed?.isValidator || false;
        const exposedPage = localExposed?.exposedPage || 0;

        // Calculate the validator's share of total era payout.
        const totalRewardPoints = new BigNumber(
          eraRewardPoints.total.toString()
        );
        const validatorRewardPoints = new BigNumber(
          eraRewardPoints.individual.find(
            ([v]: [string]) => v === validator
          )?.[1] || '0'
        );

        const avail = eraTotalPayout
          .multipliedBy(validatorRewardPoints)
          .dividedBy(totalRewardPoints);

        const valCut = commission.multipliedBy(0.01).multipliedBy(avail);

        const unclaimedPayout = total.isZero()
          ? new BigNumber(0)
          : avail
              .minus(valCut)
              .multipliedBy(staked)
              .dividedBy(total)
              .plus(isValidator ? valCut : 0)
              .integerValue(BigNumber.ROUND_DOWN);

        if (!unclaimedPayout.isZero()) {
          unclaimed[era] = {
            ...unclaimed[era],
            [validator]: [exposedPage, unclaimedPayout.toString()],
          };
          j++;
        }
      }

      // This is not currently useful for preventing re-syncing. Need to know the eras that have
      // been claimed already and remove them from `erasToCheck`.
      setLocalUnclaimedPayouts(
        network,
        era,
        activeAccount,
        unclaimed[era],
        endEra.toString()
      );
      i++;
    }

    setUnclaimedPayouts({
      ...unclaimedPayouts,
      ...unclaimed,
    });
  };

  // Removes a payout from `unclaimedPayouts` based on an era and validator record.
  const removeEraPayout = (era: string, validator: string) => {
    if (!unclaimedPayouts) {
      return;
    }

    // Delete the payout from local storage.
    const localPayouts = localStorage.getItem(`${network}_unclaimed_payouts`);
    if (localPayouts && activeAccount) {
      const parsed = JSON.parse(localPayouts);

      if (parsed?.[activeAccount]?.[era]?.[validator]) {
        delete parsed[activeAccount][era][validator];

        // Delete the era if it has no more payouts.
        if (Object.keys(parsed[activeAccount][era]).length === 0) {
          delete parsed[activeAccount][era];
        }

        // Delete the active account if it has no more eras.
        if (Object.keys(parsed[activeAccount]).length === 0) {
          delete parsed[activeAccount];
        }
      }
      localStorage.setItem(
        `${network}_unclaimed_payouts`,
        JSON.stringify(parsed)
      );
    }

    // Remove the payout from state.
    const newUnclaimedPayouts = { ...unclaimedPayouts };
    delete newUnclaimedPayouts[era][validator];

    setUnclaimedPayouts(newUnclaimedPayouts);
  };

  // Fetch payouts if active account is nominating.
  useEffect(() => {
    if (!activeEra.index.isZero()) {
      if (!isNominating()) {
        setStateWithRef('synced', setPayoutsSynced, payoutsSyncedRef);
      } else if (
        unclaimedPayouts === null &&
        payoutsSyncedRef.current !== 'syncing'
      ) {
        setStateWithRef('syncing', setPayoutsSynced, payoutsSyncedRef);
        // Start checking eras for exposures, starting with the previous one.
        checkEra(activeEra.index.minus(1));
      }
    }
  }, [unclaimedPayouts, isNominating(), activeEra, payoutsSynced]);

  // Clear payout state on network / active account change.
  useEffect(() => {
    setUnclaimedPayouts(null);
    setStateWithRef('unsynced', setPayoutsSynced, payoutsSyncedRef);
  }, [network, activeAccount]);

  return (
    <PayoutsContext.Provider
      value={{
        unclaimedPayouts,
        payoutsSynced: payoutsSyncedRef.current,
        removeEraPayout,
      }}
    >
      {children}
    </PayoutsContext.Provider>
  );
};
