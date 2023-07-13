// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
