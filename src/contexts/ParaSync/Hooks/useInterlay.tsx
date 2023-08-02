// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { rmCommas } from '@polkadotcloud/utils';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { getParaMeta } from 'config/paras';
import type { AnyApi, AnyJson } from 'types';

export const useInterlay = () => {
  const { supportedAssets, endpoints, ss58 } = getParaMeta('interlay');
  const keyring = new Keyring();
  keyring.setSS58Format(ss58);

  // Handler for fetching interlay balances. Connects to the interlay parachain, fetches token
  // balances and disconnects immediately after.
  const getBalances = async (account: string) => {
    if (!account) return null;

    // Connect to interlay via new api instance.
    const wsProvider = new WsProvider(endpoints.rpc);
    const api = await ApiPromise.create({ provider: wsProvider });

    // Fetch needed chain state.
    const [parachainId, tokensAccounts, assetRegistryMetadata]: AnyApi[] =
      await Promise.all([
        api.query.parachainInfo.parachainId(),
        api.query.tokens.accounts.entries(
          keyring.addFromAddress(account).address
        ),
        api.query.assetRegistry.metadata.entries(),
      ]);
    await api.disconnect();

    const paraId = parachainId.toString();

    // Format tokens and foreign assets.
    const tokens = formatTokens(tokensAccounts);
    const foreignAssets = formatForeignAssets(assetRegistryMetadata);

    return { paraId, tokens, foreignAssets };
  };

  // Formats token balances
  const formatTokens = (tokens: AnyJson[]) => {
    if (!tokens) return [];

    const formatted: AnyApi[] = [];
    tokens?.forEach(([k, v]) => {
      const key = Object.keys(k.toHuman()[1])[0];
      const symbol = Object.values(k.toHuman()[1])[0];
      if (supportedAssets.find((t) => t.key === key && t.symbol === symbol)) {
        const value = v.toHuman();
        formatted.push({
          ...value,
          free: rmCommas(value.free || '0'),
          frozen: rmCommas(value.frozen || '0'),
          reserved: rmCommas(value.reserved || '0'),
          key,
          symbol,
        });
      }
    });

    return formatted;
  };

  // Formats `ForeignAsset` balances metadata.
  const formatForeignAssets = (assets?: AnyJson[]) => {
    if (!assets) return;

    const formatted: Record<number, AnyJson> = {};
    assets?.forEach(([k, v]: AnyApi) => {
      const id = k.toHuman()[0];
      const metadata = v.toHuman();

      if (supportedAssets.find(({ symbol }) => symbol === id)) {
        formatted[id] = metadata;
      }
    });
    return formatted;
  };

  return {
    getBalances,
    formatForeignAssets,
  };
};
