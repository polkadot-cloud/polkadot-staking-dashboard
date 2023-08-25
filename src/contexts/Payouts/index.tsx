// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState, useEffect, useRef } from 'react';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import type { AnyApi, AnyJson, Sync } from 'types';
import { useConnect } from 'contexts/Connect';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
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
  const getErasToCheck = () => {
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
      shouldContinueProcessing(era, getErasToCheck().endEra);
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

      // eslint-disable-next-line
      const { era, exposedValidators } = data;
      const { endEra } = getErasToCheck();

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
  // eslint-disable-next-line
  const checkPendingPayouts = async () => {
    if (!api || !activeAccount) return;

    // Loop eras and determine validator ledgers to fetch.
    const erasValidators = [];
    const { startEra, endEra } = getErasToCheck();
    let currentEra = startEra;
    while (currentEra.isGreaterThanOrEqualTo(endEra)) {
      const validators = Object.keys(
        getLocalEraExposure(network.name, currentEra.toString(), activeAccount)
      );
      erasValidators.push(...validators);
      currentEra = currentEra.minus(1);
    }
    // Filter out duplicate validators.
    // eslint-disable-next-line
    const uniqueValidators = [...new Set(erasValidators)];

    // Fetch ledgers to determine which rewards have been claimed (use local data if exists).
    // eslint-disable-next-line
    // const ledgerResults = await Promise.all(uniqueValidators.map((validator: AnyJson) =>
    //     api.query.staking.ledger(validator)
    //   )
    // );
    // TODO: determine if payouts need to be calculated. Cache claimed results to local storage so
    // claimed validator ledgers do not need to be fetched again. If cached, only check `claimed:
    // false` and update if they have been.
    /*
    polkadot_payouts_claimed = {
      accountAddress: {
        1176: {
          validatorAddress1: true,
          validatorAddress2: true,
        },
        1175: {
          validatorAddress1: false,
          validatorAddress1: false,
        }
      }
    };
    */

    const calls = [];
    currentEra = startEra;
    // TODO: instead of looping eras here, loop above `polkadot_payouts_claimed` eras for the
    // accountAddress, to only fetch unclaimed payouts.
    while (currentEra.isGreaterThanOrEqualTo(endEra)) {
      const thisEra = currentEra.toString();

      // TODO: iterate through new local storage era validators where claimed is false. Can
      // also construct a new array for line 213, 214: call `getLocalEraExposure` again to get
      // `share`.
      const validatorPrefsCalls = Object.keys(
        getLocalEraExposure(network.name, thisEra.toString(), activeAccount)
      ).map((validator: AnyJson) =>
        api.query.staking.erasValidatorPrefs<AnyApi>(
          thisEra.toString(),
          validator
        )
      );

      calls.push(
        Promise.all([
          api.query.staking.erasValidatorReward<AnyApi>(thisEra.toString()),
          api.query.staking.erasRewardPoints<AnyApi>(thisEra.toString()),
          ...validatorPrefsCalls,
        ])
      );
      currentEra = currentEra.minus(1);
    }

    currentEra = startEra;
    const eraPayouts: EraPayout[] = [];
    for (const [reward, points, ...prefs] of await Promise.all(calls)) {
      const eraTotalPayout = new BigNumber(rmCommas(reward.toHuman()));
      const eraRewardPoints = points.toHuman();

      // TODO: this will be replaced.
      const exposedValidators = getLocalEraExposure(
        network.name,
        currentEra.toString(),
        activeAccount
      );

      const i = 0;
      for (const pref of prefs) {
        const eraValidatorPrefs = pref.toHuman();

        const commission = new BigNumber(
          eraValidatorPrefs.commission.replace(/%/g, '')
        ).multipliedBy(0.01);

        // Get validator from era exposure data. Falls back no null if it cannot be found.
        const validator = Object.keys(exposedValidators)?.[i] || '';
        const localExposed: LocalValidatorExposure[] | null =
          Object.values(exposedValidators);

        const staked = new BigNumber(localExposed?.[i]?.staked || '0');
        const total = new BigNumber(localExposed?.[i]?.total || '0');
        const isValidator = localExposed?.[i]?.isValidator || false;

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
        eraPayouts.push({ era: currentEra, payout: rewardValue });
      }
      currentEra = currentEra.minus(1);
    }

    setPendingPayouts(eraPayouts);
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
