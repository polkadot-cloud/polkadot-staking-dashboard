// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { Sync } from 'types';
import type { ParaSyncContextInterface } from './types';
import { defaultParaSyncContext } from './defaults';

export const ParaSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Reference whether the app has been synced.
  const isSyncing = useRef<Sync>('unsynced');

  // We need to connect to `interlay` parachain and check the user's balances.
  const syncBalances = async () => {
    isSyncing.current = 'syncing';

    // Connect to interlay via new api instance.
    const wsProvider = new WsProvider(
      'wss://interlay.api.onfinality.io/public-ws'
    );

    // eslint-disable-next-line
    const api = await ApiPromise.create({ provider: wsProvider });
    // TODO: query `tokens.accounts` to get token balances on chain.

    // Sync complete.
    isSyncing.current = 'synced';
  };

  useEffect(() => {
    if (isSyncing.current === 'unsynced') {
      syncBalances();
    }
  }, [isSyncing.current]);

  return (
    <ParaSyncContext.Provider value={{}}>{children}</ParaSyncContext.Provider>
  );
};

export const ParaSyncContext = React.createContext<ParaSyncContextInterface>(
  defaultParaSyncContext
);

export const useParaSync = () => React.useContext(ParaSyncContext);
