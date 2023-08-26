// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState, useEffect, useRef } from 'react';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import type { AnyApi, AnyJson, Sync } from 'types';
import { useConnect } from 'contexts/Connect';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetworkMetrics } from 'contexts/Network';
import Worker from 'workers/stakers?worker';
import { rmCommas, setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { MaxSupportedPayoutEras, defaultPayoutsContext } from './defaults';
import type {
  EraPayout,
  LocalValidatorExposure,
  PayoutsContextInterface,
} from './types';
import {
  getLocalEraExposure,
  hasLocalEraExposure,
  setLocalEraExposure,
} from './Utils';

const worker = new Worker();

export const PayoutsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, network } = useApi();
  const { activeAccount } = useConnect();
  const { activeEra } = useNetworkMetrics();
  const { isNominating, fetchEraStakers } = useStaking();

  // Store active accont's payout state.
  const [pendingPayouts, setPendingPayouts] = useState<EraPayout[] | null>(
    null
  );

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
  const shouldContinueProcessing = (era: BigNumber, endEra: BigNumber) => {
    // If there are more exposures to process, check next era.
    if (new BigNumber(era).isGreaterThan(endEra))
      checkEra(new BigNumber(era).minus(1));
    // If all exposures have been processed, check for pending payouts.
    else if (new BigNumber(era).isEqualTo(endEra)) {
      checkPendingPayouts();
    }
  };

  // Fetch exposure data for an era, and pass the data to the worker to determine the validator the
  // active account was backing in that era.
  const checkEra = async (era: BigNumber) => {
    if (!activeAccount) return;

    // Bypass worker if local exposure data is available.
    if (hasLocalEraExposure(network.name, era.toString(), activeAccount)) {
      // Continue processing eras, or move onto reward processing.
      shouldContinueProcessing(era, getErasInterval().endEra);
    } else {
      const exposures = await fetchEraStakers(era.toString());
      worker.postMessage({
        task: 'processEraForExposure',
        era: String(era),
        who: activeAccount,
        networkName: network.name,
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
      if (networkName !== network.name || who !== activeAccount) return;
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
  const checkPendingPayouts = async () => {
    if (!api || !activeAccount) return;

    // Loop eras and determine validator ledgers to fetch.
    const erasValidators = [];
    const { startEra, endEra } = getErasInterval();
    let erasToCheck: string[] = [];
    let currentEra = startEra;
    while (currentEra.isGreaterThanOrEqualTo(endEra)) {
      const validators = Object.keys(
        getLocalEraExposure(network.name, currentEra.toString(), activeAccount)
      );
      erasValidators.push(...validators);
      erasToCheck.push(currentEra.toString());
      currentEra = currentEra.minus(1);
    }

    // Ensure `erasToCheck` is in order, highest first.
    erasToCheck = erasToCheck.sort((a: string, b: string) =>
      new BigNumber(b).minus(a).toNumber()
    );

    // Fetch controllers in order to query ledgers.
    const uniqueValidators = [...new Set(erasValidators)];
    const bondedResults =
      await api.query.staking.bonded.multi<AnyApi>(uniqueValidators);

    const validatorControllers: Record<string, string> = {};
    for (let i = 0; i < bondedResults.length; i++) {
      const ctlr = bondedResults[i].unwrapOr(null);
      if (ctlr) validatorControllers[uniqueValidators[i]] = ctlr;
    }

    // Fetch ledgers to determine which rewards have been claimed (use local data if exists).
    const ledgerResults = await api.query.staking.ledger.multi<AnyApi>(
      Object.values(validatorControllers)
    );
    const unclaimedRewards: Record<string, string[]> = {};
    for (const ledgerResult of ledgerResults) {
      const ledger = ledgerResult.unwrapOr(null)?.toHuman();
      if (ledger) {
        unclaimedRewards[ledger.stash] = ledger.claimedRewards
          .map((r: string) => rmCommas(r))
          .filter(
            (r: string) =>
              !erasToCheck.includes(r) &&
              new BigNumber(r).isLessThanOrEqualTo(startEra) &&
              new BigNumber(r).isGreaterThanOrEqualTo(endEra)
          );
      }
    }

    // Reformat unclaimed rewards to be era => validators[].
    const unclaimedByEra: Record<string, string[]> = {};
    erasToCheck.forEach((era) => {
      const eraValidators: string[] = [];
      Object.entries(unclaimedRewards).forEach(([validator, eras]) => {
        if (eras.includes(era.toString())) eraValidators.push(validator);
      });
      if (eraValidators.length > 0)
        unclaimedByEra[era.toString()] = eraValidators;
    });

    // TODO: Cache `unclaimedByEra` to local storage so claimed validator ledgers do not need to be
    // fetched again.

    // Accumulate calls needed to fetch data to calculate rewards.
    const calls: AnyApi[] = [];
    currentEra = startEra;
    Object.entries(unclaimedByEra).forEach(([era, validators]) => {
      const validatorPrefsCalls = validators.map((validator: AnyJson) =>
        api.query.staking.erasValidatorPrefs<AnyApi>(era, validator)
      );
      if (validators.length > 0)
        calls.push(
          Promise.all([
            api.query.staking.erasValidatorReward<AnyApi>(era),
            api.query.staking.erasRewardPoints<AnyApi>(era),
            ...validatorPrefsCalls,
          ])
        );

      currentEra = currentEra.minus(1);
    });

    // Iterate calls and determine unclaimed payouts.
    currentEra = startEra;
    const unclaimedPayouts: EraPayout[] = [];

    let i = 0;
    for (const [reward, points, ...prefs] of await Promise.all(calls)) {
      const thisEra = Object.keys(unclaimedByEra)[i];
      const eraTotalPayout = new BigNumber(rmCommas(reward.toHuman()));
      const eraRewardPoints = points.toHuman();

      // Filter exposed validators for the era to only include those with unclaimed payouts.
      const unclaimedValidators = getLocalEraExposure(
        network.name,
        currentEra.toString(),
        activeAccount
      ).filter((v: string) =>
        Object.values(unclaimedByEra[thisEra.toString()]).includes(v)
      );

      let j = 0;
      for (const pref of prefs) {
        const eraValidatorPrefs = pref.toHuman();

        const commission = new BigNumber(
          eraValidatorPrefs.commission.replace(/%/g, '')
        ).multipliedBy(0.01);

        // Get validator from era exposure data. Falls back no null if it cannot be found.
        const validator = Object.keys(unclaimedValidators)?.[j] || '';
        const localExposed: LocalValidatorExposure[] | null =
          Object.values(unclaimedValidators);

        const staked = new BigNumber(localExposed?.[j]?.staked || '0');
        const total = new BigNumber(localExposed?.[j]?.total || '0');
        const isValidator = localExposed?.[j]?.isValidator || false;

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

        const rewardValue = avail
          .minus(valCut)
          .multipliedBy(staked)
          .dividedBy(total)
          .plus(isValidator ? valCut : 0);

        // TODO: Store payout data in local storage.
        unclaimedPayouts.push({ era: currentEra, payout: rewardValue });
        j++;
      }
      i++;
      currentEra = currentEra.minus(1);
    }

    setPendingPayouts(unclaimedPayouts);
    setStateWithRef('synced', setPayoutsSynced, payoutsSyncedRef);
  };

  // Fetch payouts if active account is nominating.
  useEffect(() => {
    if (
      isNominating() &&
      !activeEra.index.isZero() &&
      payoutsSyncedRef.current === 'unsynced'
    ) {
      payoutsSyncedRef.current = 'syncing';
      // Start checking eras for exposures, starting with the previous one.
      checkEra(activeEra.index.minus(1));
    }
  }, [isNominating(), activeEra]);

  // Clear payout state on network / active account change.
  useEffectIgnoreInitial(() => {
    if (pendingPayouts !== null) {
      setPendingPayouts(null);
      setStateWithRef('unsynced', setPayoutsSynced, payoutsSyncedRef);
    }
  }, [network, activeAccount]);

  return (
    <PayoutsContext.Provider
      value={{ pendingPayouts, payoutsSynced: payoutsSyncedRef.current }}
    >
      {children}
    </PayoutsContext.Provider>
  );
};

export const PayoutsContext = React.createContext<PayoutsContextInterface>(
  defaultPayoutsContext
);

export const useBonded = () => React.useContext(PayoutsContext);
