// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useEffect } from 'react';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import type { AnyApi, Sync, AnyJson } from 'types';
import { useConnect } from 'contexts/Connect';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { useNetworkMetrics } from 'contexts/Network';
import { MaxSupportedPayoutEras, defaultPayoutsContext } from './defaults';
import type { PayoutsContextInterface } from './types';

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

  // Fetch pending payouts.
  const fetchPendingPayouts = async () => {
    if (!api) return;

    // TODO: clear local storage eras that are older than `MaxSupportedPayoutEras`.

    // Fetch last era payouts.
    const startEra = activeEra?.index.minus(1).toNumber() || 1;
    const finishEra = Math.max(startEra - MaxSupportedPayoutEras, 1);
    const calls = [];
    for (let i = startEra; i >= finishEra; i--) {
      // TODO: only fetch eras that are not in local storage.
      calls.push(api.query.staking.erasRewardPoints<AnyApi>(i));
    }

    const eraPayouts = await Promise.all(calls);
    for (const eraPayout of eraPayouts) {
      // eslint-disable-next-line
      const { total, individual } = eraPayout;

      // TODO: store this era payout in local storage.

      // TODO: Check if active account had a payout in this era. If so, store in Payouts and in local stoarage.
    }

    // TODO: commit all payouts to state once all synced.
    setPayouts({});
    payoutsSynced.current = 'synced';
  };

  // Fetch payouts if active account is nominating.
  useEffect(() => {
    if (
      isNominating() &&
      !activeEra.index.isZero() &&
      payoutsSynced.current === 'unsynced'
    ) {
      payoutsSynced.current = 'syncing';
      fetchPendingPayouts();
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
