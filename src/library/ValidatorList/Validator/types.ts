// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
  showMenu: boolean;
}
