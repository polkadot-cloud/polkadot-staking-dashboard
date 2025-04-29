// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { UnlockChunk } from './types'

// Gets the total unlocking and unlocked amount.
export const getUnlocking = (chunks: UnlockChunk[], thisEra: number) => {
  let totalUnlocking = 0n
  let totalUnlocked = 0n

  for (const { value, era } of chunks) {
    if (thisEra > era) {
      totalUnlocked = totalUnlocked + value
    } else {
      totalUnlocking = totalUnlocking + value
    }
  }
  return { totalUnlocking, totalUnlocked }
}
