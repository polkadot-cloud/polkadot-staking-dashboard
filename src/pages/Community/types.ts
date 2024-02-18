// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ValidatorSupportedChains } from '@polkadot-cloud/assets/types';
import type { Dispatch, SetStateAction } from 'react';

export interface ItemProps {
  item: Item;
  actionable: boolean;
}

export interface Item {
  bio?: string;
  name: string;
  email?: string;
  twitter?: string;
  website?: string;
  thumbnail: string;
  validators: Partial<{
    [K in ValidatorSupportedChains]: string[];
  }>;
}

export interface CommunitySectionsContextInterface {
  setActiveSection: (t: number) => void;
  activeSection: number;
  activeItem: Item;
  setActiveItem: Dispatch<SetStateAction<Item>>;
  scrollPos: number;
  setScrollPos: Dispatch<SetStateAction<number>>;
}
