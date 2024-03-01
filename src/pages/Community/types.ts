// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors

import type { ValidatorSupportedChains } from '@w3ux/validator-assets';
import type { Dispatch, SetStateAction } from 'react';

export interface ItemProps {
  item: Item;
  actionable: boolean;
}

export interface Item {
  bio?: string;
  name: string;
  email?: string;
  x?: string;
  website?: string;
  icon: string;
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
