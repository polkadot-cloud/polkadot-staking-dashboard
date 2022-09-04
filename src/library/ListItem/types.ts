// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';

export interface BlockedProps {
  prefs: {
    commission: string;
    blocked: boolean;
  };
}

export interface CopyAddressProps {
  validator: {
    address: string;
  };
}

export interface FavouriteProps {
  address: string;
}

export interface IdentityProps {
  validator: {
    address: string;
  };
  batchIndex: number;
  batchKey: string;
}

export interface MetricsProps {
  display: string;
  address: string;
}

export interface NominationStatusProps {
  address: string;
  bondType: string;
  nominator: MaybeAccount;
}

export interface OversubscribedProps {
  batchIndex: number;
  batchKey: string;
}

export interface SelectProps {
  item: {
    address: string;
  };
}
