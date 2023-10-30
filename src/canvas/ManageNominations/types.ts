// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Validator } from 'contexts/Validators/types';

export interface FavoritesPromptProps {
  callback: (newNominations: Validator[]) => void;
  nominations: Validator[];
}

export interface RevertPromptProps {
  onRevert: () => void;
}
