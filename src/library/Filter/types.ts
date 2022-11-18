// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

export interface ItemProps {
  icon: IconProp;
  label?: string;
  transform?: string;
  onClick: () => void;
  disabled?: boolean;
  active: boolean;
}

export interface CategoryProps {
  title: string;
  buttons?: Array<any>;
  children: React.ReactNode;
}

export interface ValidatorFilterContextInterface {
  orderValidators: (v: string) => void;
  applyValidatorOrder: (l: any, o: string) => any;
  applyValidatorFilters: (l: any, k: string, f?: string[]) => any;
  toggleFilterValidators: (v: string, l: any) => void;
  toggleAllValidatorFilters: (t: number) => void;
  resetValidatorFilters: () => void;
  validatorSearchFilter: (l: any, k: string, v: string) => void;
  validatorFilters: string[];
  validatorOrder: string;
}
