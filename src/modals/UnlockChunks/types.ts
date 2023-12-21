// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { UnlockChunk } from 'contexts/Balances/types';
import type { BondFor } from 'types';

export interface FormsProps {
  setSection: (section: number) => void;
  unlock: UnlockChunk | null;
  task: string | null;
  incrementCalculateHeight: () => void;
}

export interface ChunkProps {
  chunk: UnlockChunk;
  bondFor: BondFor;
  onRebond: (chunk: UnlockChunk) => void;
}
