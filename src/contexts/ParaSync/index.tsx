// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import type { AnyApi, AnyJson, Sync } from 'types';
import { getParaMeta } from 'config/paras';
import { useConnect } from 'contexts/Connect';
import { useApi } from 'contexts/Api';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { rmCommas } from '@polkadotcloud/utils';
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

  // Store parachain token balance metadata.
  const [paraBalances, setParaBalances] = useState<AnyJson>({});

  // Store parachain foreign asset registry metadata.
  const [paraForeignAssets, setParaForeignAssets] = useState<AnyJson>({});

  // Reference whether the app has been synced.
  const isSyncingRef = useRef<Sync>('unsynced');

  // Keyring instance to use for parachain account formatting.
  const keyring = new Keyring();

  // Metadata for the parachains used in this context.
  const paraInterlay = getParaMeta('interlay');
  const paraAssetHub = getParaMeta('assethub');

  // We need to connect to parachains and check the user's balances.
  const syncBalances = async () => {
    if (!activeAccount || isSyncingRef.current !== 'unsynced') return;
    isSyncingRef.current = 'syncing';

    // Sync chain states to get supported local and foreign assets.
    const assetHubState = await getAssetHubBalances(activeAccount);
    const interlayState = await getInterlayBalances(activeAccount);

    // Format foreign asset metadata.
    const foreignAssetsMetadata: Record<number, AnyJson> = {};
    interlayState.assetRegistry?.forEach(([idRaw, metadataRaw]: AnyApi) => {
      const id = idRaw.toHuman();
      const metadata = metadataRaw.toHuman();
      const { symbol } = metadata;
      // NOTE: USDT is the only supported foreign asset for now.
      if (symbol === 'USDT') {
        foreignAssetsMetadata[id] = metadata;
      }
    });

    // Format token balances.
    const tokenBalances: AnyApi[] = [];
    interlayState.tokens?.forEach(([key, value]: AnyApi) => {
      tokenBalances.push({
        assetType: key.toHuman()[1],
        ...value.toHuman(),
      });
    });

    setParaForeignAssets({
      ...paraForeignAssets,
      interlay: foreignAssetsMetadata,
    });
    setParaBalances({
      ...paraBalances,
      interlay: {
        paraId: interlayState.paraId,
        tokens: [...tokenBalances],
      },
      assethub: {
        paraId: assetHubState.paraId,
        tokens: [assetHubState.asset],
      },
    });

    // Sync complete.
    isSyncingRef.current = 'synced';
  };

  // Handler for fetching interlay balances. Connects to the interlay parachain, fetches token
  // balances and disconnects immediately after.
  const getAssetHubBalances = async (account: string) => {
    keyring.setSS58Format(paraAssetHub.ss58);

    // Connect to interlay via new api instance.
    const wsProvider = new WsProvider(paraAssetHub.endpoints.rpc);
    const api = await ApiPromise.create({ provider: wsProvider });

    // Fetch needed chain state.
    const [paraIdRaw, assetRaw]: AnyApi[] = await Promise.all([
      api.query.parachainInfo.parachainId(),
      // TODO: Abstract 1984 with USDT token, SupportedTokens.
      api.query.assets.account(1984, keyring.addFromAddress(account).address),
    ]);
    const paraId = paraIdRaw.toString();
    const assetHuman = assetRaw.toHuman();
    const asset = {
      ...assetHuman,
      id: 1984,
      symbol: 'USDT',
      balance: rmCommas(assetHuman.balance),
    };

    await api.disconnect();
    return { paraId, asset };
  };

  // Handler for fetching interlay balances. Connects to the interlay parachain, fetches token
  // balances and disconnects immediately after.
  const getInterlayBalances = async (account: string) => {
    keyring.setSS58Format(paraInterlay.ss58);

    // Connect to interlay via new api instance.
    const wsProvider = new WsProvider(paraInterlay.endpoints.rpc);
    const api = await ApiPromise.create({ provider: wsProvider });

    // Fetch needed chain state.
    const [paraIdRaw, tokens, assetRegistry]: AnyApi[] = await Promise.all([
      api.query.parachainInfo.parachainId(),
      api.query.tokens.accounts.entries(
        keyring.addFromAddress(account).address
      ),
      api.query.assetRegistry.metadata.entries(),
    ]);
    const paraId = paraIdRaw.toString();

    await api.disconnect();
    return { paraId, tokens, assetRegistry };
  };

  // NOTE: could make `syncBalances` cancelable and cancel when this useEffect is triggered.
  useEffectIgnoreInitial(() => {
    isSyncingRef.current = 'unsynced';
    setParaBalances({});
    syncBalances();
  }, [activeAccount, network]);

  return (
    <ParaSyncContext.Provider
      value={{ paraBalances, paraSyncing: isSyncingRef.current }}
    >
      {children}
    </ParaSyncContext.Provider>
  );
};

export const ParaSyncContext = React.createContext<ParaSyncContextInterface>(
  defaultParaSyncContext
);

export const useParaSync = () => React.useContext(ParaSyncContext);
