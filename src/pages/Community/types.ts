// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors

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
  validators: Record<string, string>;
}

export interface CommunitySectionsContextInterface {
  setActiveSection: (t: number) => void;
  activeSection: number;
  activeItem: Item;
  setActiveItem: Dispatch<SetStateAction<Item>>;
  scrollPos: number;
  setScrollPos: Dispatch<SetStateAction<number>>;
}
