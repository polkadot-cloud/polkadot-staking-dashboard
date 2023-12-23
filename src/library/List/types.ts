// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@polkadot-cloud/react/types';
import type React from 'react';
import type { ReactNode } from 'react';
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

export interface ListContextInterface {
  setSelectActive: (selectedActive: boolean) => void;
  addToSelected: (item: AnyJson) => void;
  removeFromSelected: (items: AnyJson[]) => void;
  resetSelected: () => void;
  setListFormat: (v: 'col' | 'row') => void;
  selected: AnyJson[];
  selectActive: boolean;
  listFormat: 'col' | 'row';
  selectToggleable: boolean;
}

export interface ListProviderProps {
  selectToggleable?: boolean;
  selectActive?: boolean;
  children: ReactNode;
}
