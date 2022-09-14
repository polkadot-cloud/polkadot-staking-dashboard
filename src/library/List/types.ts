// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface PaginationWrapperProps {
  next: boolean;
  prev: boolean;
}

export interface ListProps {
  flexBasisLarge: string;
}

export interface PaginationProps {
  page: number;
  total: number;
  setter: (p: number) => void;
}
