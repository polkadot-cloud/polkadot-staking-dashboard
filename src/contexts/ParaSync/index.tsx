// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import type { AnyApi, AnyJson, Sync } from 'types';
import { getParaMeta } from 'config/paras';
import { useConnect } from 'contexts/Connect';
import { useApi } from 'contexts/Api';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
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
  const isSyncingRef = useRef<Sync>('unsynced');

  // We need to connect to `interlay` parachain and check the user's balances.
  const syncBalances = async () => {
    if (!activeAccount || isSyncingRef.current !== 'unsynced') return;
    const { endpoints, ss58 } = getParaMeta('interlay');

    isSyncingRef.current = 'syncing';
    const keyring = new Keyring();
    keyring.setSS58Format(ss58);

    // Reformat active account to be interlay compatible.
    const activeAccountPara = keyring.addFromAddress(activeAccount).address;

    // Connect to interlay via new api instance.
    const wsProvider = new WsProvider(endpoints.rpc);
    const api = await ApiPromise.create({ provider: wsProvider });

    const tokens = await api.query.tokens.accounts.keys(activeAccountPara);

    const tokenBalances: AnyApi[] = [];
    tokens.forEach((a: AnyApi) => {
      tokenBalances.push(a.toHuman()[1]);
    });
    setParaBalances({
      ...paraBalances,
      interlay: [...tokenBalances],
    });

    // Sync complete.
    isSyncingRef.current = 'synced';
    // Disconnect from chain.
    await api.disconnect();
  };

  // NOTE: could make `syncBalances` cancelable and cancel when this useEffect is triggered.
  useEffectIgnoreInitial(() => {
    isSyncingRef.current = 'unsynced';
    syncBalances();
  }, [activeAccount, network]);

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
