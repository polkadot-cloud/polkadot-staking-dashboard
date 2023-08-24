// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState, useEffect, useRef } from 'react';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import type { AnyApi, Sync, AnyJson } from 'types';
import { useConnect } from 'contexts/Connect';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { useNetworkMetrics } from 'contexts/Network';
import Worker from 'workers/stakers?worker';
import { rmCommas, setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { MaxSupportedPayoutEras, defaultPayoutsContext } from './defaults';
import type { PayoutsContextInterface } from './types';
import { getLocalEraExposure, setLocalEraExposure } from './Utils';

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
  const [payouts, setPayouts] = useState<AnyJson>(null);

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

    const localEraExposure = getLocalEraExposure(
      network.name,
      era.toString(),
      activeAccount
    );

    // Bypass worker if local exposure data is available.
    if (localEraExposure) {
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
      const { era, exposedValidator } = data;
      const { endEra } = getErasToCheck();

      // Store received era exposure data results in local storage.
      setLocalEraExposure(
        networkName,
        era,
        who,
        exposedValidator,
        endEra.toString()
      );

      // Continue processing eras, or move onto reward processing.
      shouldContinueProcessing(era, endEra);
    }
  };

  // Start pending payout process once exposure data is fetched.
  // eslint-disable-next-line
  const checkPendingPayouts = async () => {
    if (!api) return;

    // Fetch reward data and determine whether there are pending payouts.
    const { startEra, endEra } = getErasToCheck();
    let currentEra = startEra;
    const calls = [];
    while (currentEra.isGreaterThanOrEqualTo(endEra)) {
      calls.push(
        Promise.all([
          api.query.staking.erasValidatorReward<AnyApi>(currentEra.toString()),
          api.query.staking.erasRewardPoints<AnyApi>(currentEra.toString()),
        ])
      );
      currentEra = currentEra.minus(1);
    }

    currentEra = startEra;
    for (const result of await Promise.all(calls)) {
      const eraValidatorReward = new BigNumber(rmCommas(result[0].toHuman()));
      const eraRewardPoints = result[1].toHuman();

      // TODO: get validator from earlier exposure data processing.
      const validator = 0;

      const total = new BigNumber(rmCommas(eraRewardPoints.total));
      const individual = new BigNumber(
        rmCommas(eraRewardPoints.individual?.[validator] || '0')
      );
      const share = individual.isZero()
        ? new BigNumber(0)
        : individual.dividedBy(total);
      const payout = eraValidatorReward.multipliedBy(share);

      console.log(
        'era ',
        currentEra.toString(),
        ' payout: ',
        payout.toString()
      );

      // TODO: Store payout data in local stoarage.

      currentEra = currentEra.minus(1);
    }

    // TODO: commit all payout data to state.
    setPayouts({});

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
    if (payouts !== null) {
      setPayouts(null);
      setStateWithRef('unsynced', setPayoutsSynced, payoutsSyncedRef);
    }
  }, [network, activeAccount]);

  return (
    <PayoutsContext.Provider
      value={{ payouts, payoutsSynced: payoutsSyncedRef.current }}
    >
      {children}
    </PayoutsContext.Provider>
  );
};

export const PayoutsContext = React.createContext<PayoutsContextInterface>(
  defaultPayoutsContext
);

export const useBonded = () => React.useContext(PayoutsContext);
