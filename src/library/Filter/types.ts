// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ButtonProps } from 'library/Button/types';

export interface ItemProps {
  icon: IconProp;
  label?: string;
  transform?: string;
  onClick: () => void;
  disabled?: boolean;
  active: boolean;
  width?: number;
}

export interface CategoryProps {
  title: string;
  buttons?: Array<ButtonProps>;
  children: React.ReactNode;
}

export interface ValidatorFilterContextInterface {
  orderValidators: (v: string) => void;
  applyValidatorOrder: (l: any, o: string) => any;
  applyValidatorFilters: (l: any, k: string, f?: string[]) => void;
  toggleFilterValidators: (v: string, l: any) => void;
  toggleAllValidatorFilters: (t: number) => void;
  resetValidatorFilters: () => void;
  validatorSearchFilter: (l: any, k: string, v: string) => void;
  validatorFilters: string[];
  validatorOrder: string;
}
