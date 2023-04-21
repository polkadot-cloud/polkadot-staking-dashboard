// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Proxy } from 'contexts/Accounts/Proxies/type';
import type { ExtensionAccount } from 'contexts/Extensions/types';
import type { PoolMembership } from 'contexts/Pools/types';
import type { MaybeAccount } from 'types';

export interface AccountItemProps {
  meta: ExtensionAccount | null;
  address?: MaybeAccount;
  label?: Array<string>;
  disconnect?: boolean;
  asElement?: boolean;
  badge?: string;
  delegator?: string;
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
