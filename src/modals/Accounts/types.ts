// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { PoolMembership } from 'contexts/Pools/PoolMemberships/types';
import type { Proxy } from 'contexts/Proxies/types';
import type { MaybeAddress } from 'types';

export interface AccountItemProps {
  address: MaybeAddress;
  label?: string[];
  asElement?: boolean;
  delegator?: string;
  noBorder?: boolean;
  proxyType?: string;
  transferrableBalance?: BigNumber;
}

export interface DelegatesProps {
  delegator: string;
  delegates: Proxy | undefined;
}

export interface AccountInPool extends PoolMembership {
  delegates?: Proxy;
}

export interface AccountNominating {
  address: MaybeAddress;
  stashImported: boolean;
  delegates?: Proxy;
}

export interface AccountNotStaking {
  address: string;
  delegates?: Proxy;
}

export type AccountNominatingAndInPool = AccountNominating & AccountInPool;
