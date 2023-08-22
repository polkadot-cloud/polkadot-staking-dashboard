// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useEffect } from 'react';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import type { AnyApi, Sync, AnyJson } from 'types';
import { useConnect } from 'contexts/Connect';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { useNetworkMetrics } from 'contexts/Network';
import Worker from 'workers/stakers?worker';
import { MaxSupportedPayoutEras, defaultPayoutsContext } from './defaults';
import type { PayoutsContextInterface } from './types';

const worker = new Worker();

export const PayoutsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, network } = useApi();
  const { isNominating } = useStaking();
  const { activeAccount } = useConnect();
  const { activeEra } = useNetworkMetrics();

  // Store active accont's payout state.
  const [payouts, setPayouts] = React.useState<AnyJson>(null);

  // Track whether payouts have been fetched.
  const payoutsSynced = React.useRef<Sync>('unsynced');

  // Calculate eras to check for pending payouts.
  const getErasToCheck = () => {
    const start = activeEra?.index.minus(1).toNumber() || 1;
    const end = Math.max(start - MaxSupportedPayoutEras, 1);
    return {
      start,
      end,
    };
  };

  // Fetch exposure data required for pending payouts.
  const fetchExposureData = async () => {
    if (!api || !activeAccount) return;

    const calls = [];
    const { start, end } = getErasToCheck();
    for (let i = start; i >= end; i--) {
      // TODO: only fetch eras that are not in local storage.
      calls.push(api.query.staking.erasStakers.entries(i));
    }

    const eraExposures = await Promise.all(calls);
    for (const eraExposure of eraExposures) {
      // eslint-disable-next-line
      const exposures = eraExposure.map(([keys, val]: AnyApi) => ({
        keys: keys.toHuman(),
        val: val.toHuman(),
      }));
      // TODO: store exposure data in local storage.
    }
  };

  // Fetch pending payouts.
  const fetchPendingPayouts = async () => {
    if (!api || !activeAccount) return;

    // TODO: clear local storage eras that are older than `HistoryDepth`.

    // Get eras required for payout calculation.
    const { start, end } = getErasToCheck();

    // Accumulate needed calls for reward data.
    const calls = [];
    for (let i = start; i >= end; i--) {
      // TODO: only fetch eras that are not in local storage.
      calls.push(api.query.staking.erasRewardPoints<AnyApi>(i));
    }

    const eraPayouts = await Promise.all(calls);
    for (const eraPayout of eraPayouts) {
      // eslint-disable-next-line
      const { total, individual } = eraPayout;

      // TODO: store this era payout in local storage.
      // const activeAccountPayout = rmCommas(individual[activeAccount] || 0);
      // console.log(activeAccountPayout);

      // TODO: Check if active account had a payout in this era. If so, store in Payouts and in local stoarage.
      // do this next.
    }

    // TODO: commit all payouts to state once all synced.
    setPayouts({});
  };

  // Start pending payout process.
  const startPendingPayoutProcess = async () => {
    // Populate localStorage with the needed exposure data.
    await fetchExposureData();
    // Fetch reward data and determine whether there are pending payouts.
    await fetchPendingPayouts();
    payoutsSynced.current = 'synced';
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
      // ensure still same conditions.
      const { networkName, who } = data;
      if (networkName !== network.name || who !== activeAccount) {
        return;
      }

      // eslint-disable-next-line
      const { currentEra, exposed, exposeValidator } = data;

      // TODO: process received era exposure data, set in local storage.
    }
  };

  // Fetch payouts if active account is nominating.
  useEffect(() => {
    if (
      isNominating() &&
      !activeEra.index.isZero() &&
      payoutsSynced.current === 'unsynced'
    ) {
      payoutsSynced.current = 'syncing';
      startPendingPayoutProcess();
    }
  }, [isNominating(), activeEra]);

  // Clear payout state on network / active account change.
  useEffectIgnoreInitial(() => {
    if (payouts !== null) {
      setPayouts(null);
      payoutsSynced.current = 'unsynced';
    }
  }, [network, activeAccount]);

  return (
    <PayoutsContext.Provider value={{ payouts }}>
      {children}
    </PayoutsContext.Provider>
  );
};

export const PayoutsContext = React.createContext<PayoutsContextInterface>(
  defaultPayoutsContext
);

export const useBonded = () => React.useContext(PayoutsContext);
