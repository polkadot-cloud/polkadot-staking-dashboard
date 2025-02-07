// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export const percentageOf = (n1: number, n2: number): number => {
  if (n2 === 0) {
    return 0
  }
  const p = (n1 / n2) * 100
  return p > 100 ? 100 : p
}
