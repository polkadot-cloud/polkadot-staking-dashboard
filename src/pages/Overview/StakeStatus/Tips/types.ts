// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface PageToggleProps {
  start: number;
  end: number;
  page: number;
  itemsPerPage: number;
  totalItems: number;
  setPageHandler: (p: number) => void;
}
