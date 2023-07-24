// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import type { AnyApi, AnyJson, Sync } from 'types';
import type { ParaSyncContextInterface } from './types';
import { defaultParaSyncContext } from './defaults';

export const ParaSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Store para token balances.
  const [paraBalances, setParaBalances] = useState<AnyJson>({});

  // Reference whether the app has been synced.
  const isSyncing = useRef<Sync>('unsynced');

  // We need to connect to `interlay` parachain and check the user's balances.
  const syncBalances = async () => {
    isSyncing.current = 'syncing';

    // Connect to interlay via new api instance.
    const wsProvider = new WsProvider(
      'wss://interlay.api.onfinality.io/public-ws'
    );

    const api = await ApiPromise.create({ provider: wsProvider });
    const tokens = await api.query.tokens.accounts.keys(
      'wdBZx2yePrrFqtqpoc7Z66gJX9r38DzdHqH66m3AokSxt9NAn'
    );

    // eslint-disable-next-line
    tokens.forEach((a: AnyApi) => {
      // TODO: store in state.
    });

    // Sync complete.
    isSyncing.current = 'synced';

    // Disconnect from chain.
    await api.disconnect();
  };

  useEffect(() => {
    if (isSyncing.current === 'unsynced') {
      syncBalances();
    }
  }, [isSyncing.current]);

  return (
    <ParaSyncContext.Provider value={{ paraBalances }}>
      {children}
    </ParaSyncContext.Provider>
  );
};

export const ParaSyncContext = React.createContext<ParaSyncContextInterface>(
  defaultParaSyncContext
);

export const useParaSync = () => React.useContext(ParaSyncContext);
