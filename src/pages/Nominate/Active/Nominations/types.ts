// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@polkadot-cloud/react/types';
import type { ListFormat } from 'library/PoolList/types';
import type { Validator } from 'contexts/Validators/types';

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
