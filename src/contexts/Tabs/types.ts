// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface TabsContextInterface {
  setActiveTab: (t: number) => void;
  activeTab: number;
}
