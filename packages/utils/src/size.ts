// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Formats a width and height pair
export const formatSize = (
  {
    width,
    height,
  }: {
    width: string | number
    height: number
  },
  minHeight: number
) => ({
  width: width || '100%',
  height: height || minHeight,
  minHeight,
})
