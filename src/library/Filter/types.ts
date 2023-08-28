// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type React from 'react';

export interface ItemProps {
  icon?: IconProp;
  label?: string;
  transform?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface CategoryProps {
  title: string;
  buttons?: any[];
  children: React.ReactNode;
}

export interface ValidatorFilterContextInterface {
  orderValidators: (v: string) => void;
  applyValidatorOrder: (l: any, o: string) => any;
  applyValidatorFilters: (l: any, k: string, f?: string[]) => any;
  toggleFilterValidators: (v: string) => void;
  toggleAllValidatorFilters: (t: number) => void;
  resetValidatorFilters: () => void;
  validatorSearchFilter: (l: any, k: string, v: string) => void;
  validatorFilters: string[];
  validatorOrder: string;
}
