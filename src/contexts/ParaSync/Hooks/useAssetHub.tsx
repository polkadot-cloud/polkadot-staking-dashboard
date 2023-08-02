// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { rmCommas } from '@polkadotcloud/utils';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { getParaMeta } from 'config/paras';
import type { AnyApi, AnyJson } from 'types';

export const useAssetHub = () => {
  const { supportedAssets, endpoints, ss58 } = getParaMeta('assethub');
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
    const result: AnyApi = await Promise.all([
      api.query.parachainInfo.parachainId(),
      api.query.system.account(keyring.addFromAddress(account).address),
      ...supportedAssets
        .filter(({ key }) => key !== 'Native')
        .map(({ key }) =>
          api.query.assets.account(key, keyring.addFromAddress(account).address)
        ),
    ]);
    await api.disconnect();

    const [paraId, accountBalance, ...assetsRaw] = result;
    const nativeBalance = accountBalance.toHuman();

    const assets: AnyJson[] = [];
    let i = 0;
    assetsRaw?.forEach((a: AnyJson) => {
      const asset = a.toHuman();
      // index 0 is native asset.
      const supportedAssetIndex = i + 1;
      if (!asset) {
        i++;
        return;
      }

      assets.push({
        ...asset,
        key: supportedAssets[supportedAssetIndex].key,
        symbol: supportedAssets[supportedAssetIndex].symbol,
        balance: rmCommas(asset.balance),
      });
      i++;
    });

    return {
      paraId: paraId.toString(),
      assets: [
        {
          key: 'Native',
          symbol: 'DOT',
          free: rmCommas(nativeBalance?.data?.free || '0'),
          frozen: rmCommas(nativeBalance?.data?.frozen || '0'),
          reserved: rmCommas(nativeBalance?.data?.reserved || '0'),
        },
        ...assets,
      ],
    };
  };

  return {
    getBalances,
  };
};
