// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type React from 'react';
import type { BondedPool } from 'contexts/Pools/types';
import type { BondFor, MaybeAddress } from 'types';
import type { ValidatorPrefs } from 'contexts/Validators/types';
import type BigNumber from 'bignumber.js';
import type { NominationStatus } from 'library/ValidatorList/ValidatorItem/types';

export interface BlockedProps {
  prefs: ValidatorPrefs;
}

export interface CopyAddressProps {
  address: string;
}

export interface FavoriteProps {
  address: string;
}

export interface IdentityProps {
  address: string;
}

export interface PoolIdentityProps {
  pool: BondedPool;
}

export interface MetricsProps {
  display: React.ReactNode | null;
  address: string;
}

export interface NominationStatusProps {
  address: string;
  bondFor: BondFor;
  nominator: MaybeAddress;
  status?: NominationStatus;
  noMargin?: boolean;
}

export interface OversubscribedProps {
  address: MaybeAddress;
}

export interface SelectProps {
  item: {
    address: string;
  };
}

export interface ParaValidatorProps {
  address: MaybeAddress;
}

export interface EraStatusProps {
  address: MaybeAddress;
  noMargin: boolean;
  totalStake: BigNumber;
  status: 'waiting' | 'active';
}
