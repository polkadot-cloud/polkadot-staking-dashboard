// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { Validator } from 'contexts/Validators/types';
import type { ListFormat } from 'library/PoolList/types';

export interface ManageNominationsInterface {
  addToSelected: (item: AnyJson) => void;
  removeFromSelected: (item: AnyJson) => void;
  setListFormat: (format: ListFormat) => void;
  setSelectActive: (active: boolean) => void;
  resetSelected: () => void;
  selected: Validator[];
  listFormat: ListFormat;
  selectActive: boolean;
  selectTogglable: boolean;
}
