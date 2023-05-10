// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PoolMembership } from 'contexts/Pools/types';
import type { Proxy } from 'contexts/Proxies/type';
import type { MaybeAccount } from 'types';

export interface AccountItemProps {
  address?: MaybeAccount;
  label?: string[];
  disconnect?: boolean;
  asElement?: boolean;
  delegator?: string;
  noBorder?: boolean;
}

export interface DelegatesProps {
  delegator: string;
  delegates: Proxy | undefined;
}

export interface AccountInPool extends PoolMembership {
  delegates?: Proxy;
}

export interface AccountNominating {
  address: MaybeAccount;
  stashImported: boolean;
  delegates?: Proxy;
}

export interface AccountNotStaking {
  address: string;
  delegates?: Proxy;
}

export type AccountNominatingAndInPool = AccountNominating & AccountInPool;
