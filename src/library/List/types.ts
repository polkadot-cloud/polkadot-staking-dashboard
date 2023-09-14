// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type React from 'react';

export interface PaginationWrapperProps {
  $next: boolean;
  $prev: boolean;
}

export interface ListProps {
  $flexBasisLarge: string;
}

export interface PaginationProps {
  page: number;
  total: number;
  setter: (p: number) => void;
}

export interface SearchInputProps {
  handleChange: (e: React.FormEvent<HTMLInputElement>) => void;
  placeholder: string;
}
