// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolMembership } from 'contexts/Pools/types';
import type { PayeeConfig } from 'contexts/Setup/types';
import type {
  Balance,
  BalanceLocks,
  Balances,
  Ledger,
  Nominations,
  Targets,
} from 'model/Subscribe/Balance/types';
import type { MaybeAddress } from 'types';

export interface BalancesContextInterface {
  activeBalances: ActiveBalancesState;
  getNonce: (address: MaybeAddress) => number;
  getLocks: (address: MaybeAddress) => BalanceLocks;
  getBalance: (address: MaybeAddress) => Balance;
  getLedger: (source: ActiveLedgerSource) => Ledger;
  getPayee: (address: MaybeAddress) => PayeeConfig;
  getPoolMembership: (address: MaybeAddress) => PoolMembership | null;
  getNominations: (address: MaybeAddress) => Targets;
}

export type ActiveBalancesState = Record<string, ActiveBalance>;

export interface ActiveBalance {
  ledger: Ledger | null;
  balances: Balances;
  payee: PayeeConfig;
  poolMembership: PoolMembership | null;
  nominations: Nominations;
}

export type ActiveLedgerSource = {
  [key in 'stash' | 'key']?: MaybeAddress;
};
