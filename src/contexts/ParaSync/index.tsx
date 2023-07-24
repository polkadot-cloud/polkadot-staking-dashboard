// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import type { AnyApi, AnyJson, Sync } from 'types';
import { getParaMeta } from 'config/paras';
import { useConnect } from 'contexts/Connect';
import { useApi } from 'contexts/Api';
import type { ParaSyncContextInterface } from './types';
import { defaultParaSyncContext } from './defaults';

export const ParaSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Store para token balances.
  const { network } = useApi();
  const { activeAccount } = useConnect();
  const [paraBalances, setParaBalances] = useState<AnyJson>({});

  // Reference whether the app has been synced.
  // TODO: try changing to useRef once `useEffectIgnoreInitial` is in place.
  const [isSyncing, setIsSyncing] = useState<Sync>('unsynced');

  // We need to connect to `interlay` parachain and check the user's balances.
  const syncBalances = async () => {
    if (!activeAccount) return;

    const { endpoints, ss58 } = getParaMeta('interlay');

    setIsSyncing('syncing');
    const keyring = new Keyring();
    keyring.setSS58Format(ss58);

    // Reformat active account to be interlay compatible.
    const activeAccountPara = keyring.addFromAddress(activeAccount).address;

    // Connect to interlay via new api instance.
    const wsProvider = new WsProvider(endpoints.rpc);
    const api = await ApiPromise.create({ provider: wsProvider });
    const tokens = await api.query.tokens.accounts.keys(activeAccountPara);

    // eslint-disable-next-line
      tokens.forEach((a: AnyApi) => {
      // TODO: store in state.
    });

    // Sync complete.
    setIsSyncing('synced');

    // Disconnect from chain.
    await api.disconnect();
  };

  // NOTE: needs useEffectIgnoreInitial.
  // NOTE: could make `syncBalances` cancelable and cancel when this useEffect is triggered.
  useEffect(() => {
    setIsSyncing('unsynced');
  }, [activeAccount, network]);

  useEffect(() => {
    if (isSyncing === 'unsynced') {
      syncBalances();
    }
  }, [isSyncing]);

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
