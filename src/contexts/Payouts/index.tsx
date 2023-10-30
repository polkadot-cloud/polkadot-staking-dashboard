// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState, useEffect, useRef } from 'react';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import type { AnyApi, AnyJson, Sync } from 'types';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import Worker from 'workers/stakers?worker';
import { rmCommas, setStateWithRef } from '@polkadot-cloud/utils';
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

const worker = new Worker();

export const PayoutsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api } = useApi();
  const { network } = useNetwork();
  const { activeEra } = useNetworkMetrics();
  const { activeAccount } = useActiveAccounts();
  const { isNominating, fetchEraStakers } = useStaking();

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
    if (new BigNumber(era).isGreaterThan(endEra))
      checkEra(new BigNumber(era).minus(1));
    // If all exposures have been processed, check for pending payouts.
    else if (new BigNumber(era).isEqualTo(endEra)) {
      await getUnclaimedPayouts();
      setStateWithRef('synced', setPayoutsSynced, payoutsSyncedRef);
    }
  };

  // Fetch exposure data for an era, and pass the data to the worker to determine the validator the
  // active account was backing in that era.
  const checkEra = async (era: BigNumber) => {
    if (!activeAccount) return;

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
      if (task !== 'processEraForExposure') return;

      // Exit early if network or account conditions have changed.
      const { networkName, who } = data;
      if (networkName !== network || who !== activeAccount) return;
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
    if (!api || !activeAccount) return;

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

    // Helper function to check which eras a validator was exposed in.
    const validatorExposedEras = (validator: string) => {
      const exposedEras: string[] = [];
      for (const era of erasToCheck)
        if (
          Object.values(
            Object.keys(getLocalEraExposure(network, era, activeAccount))
          )?.[0] === validator
        )
          exposedEras.push(era);
      return exposedEras;
    };

    // Fetch controllers in order to query ledgers.
    const bondedResults =
      await api.query.staking.bonded.multi<AnyApi>(uniqueValidators);
    const validatorControllers: Record<string, string> = {};
    for (let i = 0; i < bondedResults.length; i++) {
      const ctlr = bondedResults[i].unwrapOr(null);
      if (ctlr) validatorControllers[uniqueValidators[i]] = ctlr;
    }

    // Fetch ledgers to determine which eras have not yet been claimed per validator. Only includes
    // eras that are in `erasToCheck`.
    const ledgerResults = await api.query.staking.ledger.multi<AnyApi>(
      Object.values(validatorControllers)
    );
    const unclaimedRewards: Record<string, string[]> = {};
    for (const ledgerResult of ledgerResults) {
      const ledger = ledgerResult.unwrapOr(null)?.toHuman();
      if (ledger) {
        // get claimed eras within `erasToCheck`.
        const erasClaimed = ledger.claimedRewards
          .map((e: string) => rmCommas(e))
          .filter(
            (e: string) =>
              new BigNumber(e).isLessThanOrEqualTo(startEra) &&
              new BigNumber(e).isGreaterThanOrEqualTo(endEra)
          );

        // filter eras yet to be claimed
        unclaimedRewards[ledger.stash] = erasToCheck
          .map((e) => e.toString())
          .filter((r: string) => validatorExposedEras(ledger.stash).includes(r))
          .filter((r: string) => !erasClaimed.includes(r));
      }
    }

    // Reformat unclaimed rewards to be { era: validators[] }.
    const unclaimedByEra: Record<string, string[]> = {};
    erasToCheck.forEach((era) => {
      const eraValidators: string[] = [];
      Object.entries(unclaimedRewards).forEach(([validator, eras]) => {
        if (eras.includes(era)) eraValidators.push(validator);
      });
      if (eraValidators.length > 0) unclaimedByEra[era] = eraValidators;
    });

    // Accumulate calls needed to fetch data to calculate rewards.
    const calls: AnyApi[] = [];
    Object.entries(unclaimedByEra).forEach(([era, validators]) => {
      if (validators.length > 0)
        calls.push(
          Promise.all([
            api.query.staking.erasValidatorReward<AnyApi>(era),
            api.query.staking.erasRewardPoints<AnyApi>(era),
            ...validators.map((validator: AnyJson) =>
              api.query.staking.erasValidatorPrefs<AnyApi>(era, validator)
            ),
          ])
        );
    });

    // Iterate calls and determine unclaimed payouts.
    const unclaimed: UnclaimedPayouts = {};
    let i = 0;
    for (const [reward, points, ...prefs] of await Promise.all(calls)) {
      const era = Object.keys(unclaimedByEra)[i];
      const eraTotalPayout = new BigNumber(rmCommas(reward.toHuman()));
      const eraRewardPoints = points.toHuman();
      const unclaimedValidators = unclaimedByEra[era];

      let j = 0;
      for (const pref of prefs) {
        const eraValidatorPrefs = pref.toHuman();
        const commission = new BigNumber(
          eraValidatorPrefs.commission.replace(/%/g, '')
        ).multipliedBy(0.01);

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

        // Calculate the validator's share of total era payout.
        const totalRewardPoints = new BigNumber(
          rmCommas(eraRewardPoints.total)
        );
        const validatorRewardPoints = new BigNumber(
          rmCommas(eraRewardPoints.individual?.[validator] || '0')
        );
        const avail = eraTotalPayout
          .multipliedBy(validatorRewardPoints)
          .dividedBy(totalRewardPoints);

        const valCut = commission.multipliedBy(avail);

        const unclaimedPayout = total.isZero()
          ? new BigNumber(0)
          : avail
              .minus(valCut)
              .multipliedBy(staked)
              .dividedBy(total)
              .plus(isValidator ? valCut : 0);

        if (!unclaimedPayout.isZero()) {
          unclaimed[era] = {
            ...unclaimed[era],
            [validator]: unclaimedPayout.toString(),
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
    if (!unclaimedPayouts) return;
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

export const PayoutsContext = React.createContext<PayoutsContextInterface>(
  defaultPayoutsContext
);

export const usePayouts = () => React.useContext(PayoutsContext);
