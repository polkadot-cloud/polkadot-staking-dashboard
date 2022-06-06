// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export interface BalancesAccount {
  address: string;
  balance: any;
  bonded: any;
  ledger: any;
  locks: any;
  nominations: any;
}

export interface BalancesContextInterface {
  getAccount: (address: string) => BalancesAccount | null;
  getAccountBalance: (address: string) => any;
  getAccountLedger: (address: string) => any;
  getAccountLocks: (address: string) => any;
  getBondedAccount: (address: string) => any;
  getAccountNominations: (address: string) => any;
  getBondOptions: (address: string) => any;
  isController: (address: string) => boolean;
  accounts: Array<BalancesAccount>;
  minReserve: BN;
  ledgersSyncingCount: number;
}
