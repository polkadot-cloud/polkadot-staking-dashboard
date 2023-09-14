// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface PoolAccountProps {
  address: string | null;
  batchKey: string;
  batchIndex: number;
}

export interface PoolsTabsContextInterface {
  setActiveTab: (t: number) => void;
  activeTab: number;
}

export interface PayoutListContextInterface {
  setListFormat: (v: string) => void;
  listFormat: string;
}
