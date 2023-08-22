// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useEffect } from 'react';
import { useStaking } from 'contexts/Staking';
import { useApi } from 'contexts/Api';
import type { Sync, AnyJson } from 'types';
import { useConnect } from 'contexts/Connect';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { defaultPayoutsContext } from './defaults';
import type { PayoutsContextInterface } from './types';

export const PayoutsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useApi();
  const { isNominating } = useStaking();
  const { activeAccount } = useConnect();

  // Store active accont's payout state.
  const [payouts, setPayouts] = React.useState<AnyJson>(null);

  // Track whether payouts have been fetched.
  const payoutsSynced = React.useRef<Sync>('unsynced');

  // Fetch payouts if active account is nominating.
  useEffect(() => {
    if (isNominating() && payoutsSynced.current === 'unsynced') {
      payoutsSynced.current = 'syncing';
      setPayouts({});
      payoutsSynced.current = 'synced';
    }
  }, [isNominating()]);

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
