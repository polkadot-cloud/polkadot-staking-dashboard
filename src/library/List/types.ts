// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@polkadot-cloud/react/types';
import type React from 'react';
import type { DisplayFor } from 'types';

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

export interface SelectableProps {
  actionsAll: AnyJson[];
  actionsSelected: AnyJson[];
  canSelect: boolean;
  displayFor: DisplayFor;
}
