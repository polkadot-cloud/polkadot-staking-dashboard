// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface BlockedProps {
  prefs: any;
}

export interface CopyAddressProps {
  validator: any;
}

export interface FavouriteProps {
  address: any;
}

export interface IdentityProps {
  validator: any;
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
}

export interface OversubscribedProps {
  batchIndex: number;
  batchKey: string;
}

export interface SelectProps {
  validator: any;
}

export interface NominationProps {
  validator: any;
  toggleFavourites: boolean;
  batchIndex: number;
  batchKey: string;
  bondType: string;
}

export interface DefaultProps {
  validator: any;
  toggleFavourites: boolean;
  batchIndex: number;
  batchKey: string;
  showStatus: boolean;
  showMenu: boolean;
}
