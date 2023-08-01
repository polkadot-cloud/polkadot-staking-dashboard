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
import BigNumber from 'bignumber.js';
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
    interlayState.assetRegistry?.forEach(([id, metadataRaw]: AnyApi) => {
      const metadata = metadataRaw.toHuman();
      if (
        paraInterlay.supportedAssets.find(
          ({ symbol }: AnyJson) => symbol === metadata.symbol
        )
      ) {
        foreignAssetsMetadata[id.toHuman()] = metadata;
      }
    });

    setParaForeignAssets({
      ...paraForeignAssets,
      interlay: foreignAssetsMetadata,
    });
    setParaBalances({
      ...paraBalances,
      interlay: {
        paraId: interlayState.paraId,
        tokens: interlayState.tokens,
      },
      assethub: {
        paraId: assetHubState.paraId,
        tokens: assetHubState.assets,
      },
    });
    isSyncingRef.current = 'synced';
  };

  // Handler for fetching interlay balances. Connects to the interlay parachain, fetches token
  // balances and disconnects immediately after.
  const getAssetHubBalances = async (account: string) => {
    keyring.setSS58Format(paraAssetHub.ss58);
    const { supportedAssets, endpoints } = paraAssetHub;

    // Connect to interlay via new api instance.
    const wsProvider = new WsProvider(endpoints.rpc);
    const api = await ApiPromise.create({ provider: wsProvider });

    // Fetch needed chain state.
    const [paraId, accountBalance, assetRaw]: AnyApi[] = await Promise.all([
      api.query.parachainInfo.parachainId(),
      api.query.balances.account(keyring.addFromAddress(account).address),
      ...supportedAssets.map(({ key }) =>
        api.query.assets.account(key, keyring.addFromAddress(account).address)
      ),
    ]);
    await api.disconnect();

    const asset = assetRaw.toHuman();
    const nativeBalance = accountBalance.toHuman();

    return {
      paraId: paraId.toString(),
      assets: [
        {
          id: 'Native',
          symbol: 'DOT',
          free: rmCommas(nativeBalance.free),
          frozen: rmCommas(nativeBalance.frozen),
          reserved: rmCommas(nativeBalance.reserved),
        },
        {
          ...asset,
          id: supportedAssets[0].key,
          symbol: supportedAssets[0].symbol,
          balance: rmCommas(asset.balance),
        },
      ],
    };
  };

  // Handler for fetching interlay balances. Connects to the interlay parachain, fetches token
  // balances and disconnects immediately after.
  const getInterlayBalances = async (account: string) => {
    keyring.setSS58Format(paraInterlay.ss58);
    const { supportedAssets, endpoints } = paraInterlay;

    // Connect to interlay via new api instance.
    const wsProvider = new WsProvider(endpoints.rpc);
    const api = await ApiPromise.create({ provider: wsProvider });

    // Fetch needed chain state.
    const [paraIdRaw, tokensRaw, assetRegistry]: AnyApi[] = await Promise.all([
      api.query.parachainInfo.parachainId(),
      api.query.tokens.accounts.entries(
        keyring.addFromAddress(account).address
      ),
      api.query.assetRegistry.metadata.entries(),
    ]);
    const paraId = paraIdRaw.toString();

    // Format token balances.
    const tokens: AnyApi[] = [];
    tokensRaw?.forEach(([key, valueRaw]: AnyApi) => {
      const assetType = Object.keys(key.toHuman()[1])[0];
      const symbol = Object.values(key.toHuman()[1])[0];
      if (
        supportedAssets.find(
          (t: AnyJson) => t.key === assetType && t.symbol === symbol
        )
      ) {
        const value = valueRaw.toHuman();
        tokens.push({
          ...value,
          free: rmCommas(value.free),
          frozen: rmCommas(value.frozen),
          reserved: rmCommas(value.reserved),
          assetType: key.toHuman()[1],
        });
      }
    });

    await api.disconnect();
    return { paraId, tokens, assetRegistry };
  };

  // NOTE: could make `syncBalances` cancelable and cancel when this useEffect is triggered.
  useEffectIgnoreInitial(() => {
    isSyncingRef.current = 'unsynced';
    setParaBalances({});
    syncBalances();
  }, [activeAccount, network]);

  // Getter for Asset Hub token balance.
  // getAssetHubBalance('USDT');
  const getAssetHubBalance = (symbol: string) => {
    const token = paraBalances?.assethub?.tokens.find(
      (t: AnyJson) => t.symbol === symbol
    );

    if (token) {
      if (token.id === 'Native') {
        return new BigNumber(token.free);
      }
      return new BigNumber(token.balance);
    }
    return undefined;
  };

  // Getter for interlay balance.
  // getInterlayBalance('ForeignAsset', '2');
  const getInterlayBalance = (assetType: string, symbol: string) => {
    const token = paraBalances?.interlay?.tokens?.find(
      (t: AnyJson) => t?.assetType[assetType] === symbol
    );
    return !token ? undefined : new BigNumber(token.free);
  };

  return (
    <ParaSyncContext.Provider
      value={{
        paraBalances,
        paraSyncing: isSyncingRef.current,
        getters: {
          assethub: getAssetHubBalance,
          interlay: getInterlayBalance,
        },
      }}
    >
      {children}
    </ParaSyncContext.Provider>
  );
};

export const ParaSyncContext = React.createContext<ParaSyncContextInterface>(
  defaultParaSyncContext
);

export const useParaSync = () => React.useContext(ParaSyncContext);
