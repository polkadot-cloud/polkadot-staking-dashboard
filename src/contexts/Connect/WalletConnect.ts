// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionTypes } from '@walletconnect/types';
import UniversalProvider from '@walletconnect/universal-provider';
import { DappName } from 'consts';

// Initialise a new Wallet Connect provider.
export class WalletConnect {
  static initialize = async () => {
    const provider = await UniversalProvider.init({
      projectId: 'f75434b01141677e4ee7ddf70fee56b4',
      relayUrl: 'wss://relay.walletconnect.com',
      metadata: {
        name: DappName,
        description: 'Polkadot Staking Dashboard',
        url: 'https://staking.polkadot.network/',
        icons: ['../../../public/favicons/polkadot/apple-touch-icon.png'],
      },
    });
    return provider;
  };

  static getAccounts = (session: SessionTypes.Struct) => {
    let accounts: string[] = [];
    if (session) {
      const wcAccounts = Object.values(session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat();
      accounts = wcAccounts.map((wcAccount) => {
        const address = wcAccount.split(':')[2];
        return address;
      });
    }
    return accounts;
  };
}
