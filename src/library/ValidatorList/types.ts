// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction, AnyJson, DisplayFor } from '@w3ux/types';
import type { Validator } from 'contexts/Validators/types';
import type { BondFor, MaybeAddress } from 'types';

export interface ValidatorListProps {
  validators: Validator[];
  bondFor: BondFor;
  allowMoreCols?: boolean;
  generateMethod?: string;
  nominator?: MaybeAddress;
  allowFilters?: boolean;
  toggleFavorites?: boolean;
  pagination?: boolean;
  title?: string;
  format?: 'nomination' | 'default';
  selectable?: boolean;
  onSelected?: AnyFunction;
  actions?: AnyJson[];
  showMenu?: boolean;
  displayFor?: DisplayFor;
  allowSearch?: boolean;
  allowListFormat?: boolean;
  alwaysRefetchValidators?: boolean;
  defaultFilters?: AnyJson;
  defaultOrder?: string;
  selectActive?: boolean;
  selectToggleable?: boolean;
  refetchOnListUpdate?: boolean;
}
