// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface PageToggleProps {
  start: number;
  end: number;
  page: number;
  itemsPerPage: number;
  totalItems: number;
  setPageHandler: (p: number) => void;
}
