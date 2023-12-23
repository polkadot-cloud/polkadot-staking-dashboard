// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnimationControls } from 'framer-motion';

export interface PageToggleProps {
  start: number;
  end: number;
  page: number;
  itemsPerPage: number;
  totalItems: number;
  setPageHandler: (p: number) => void;
}

export interface TipItemsProps {
  items: TipDisplay[];
  page: number;
  showTitle: boolean;
}

export interface TipDisplay {
  description: string[];
  id: string;
  page: string;
  s: number;
  title: string;
  subtitle: string;
}

export type TipDisplayWithControls = TipDisplay & {
  controls: AnimationControls;
  index: number;
  initial: boolean;
};
