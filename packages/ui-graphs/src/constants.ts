// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Chart configuration constants
export const MAX_PAYOUT_DAYS = 60
export const PAYOUT_AVERAGE_DAYS = 10

// Chart styling constants
export const DEFAULT_POINT_RADIUS = 0
export const DEFAULT_BORDER_RADIUS = 3
export const DEFAULT_FONT_SIZE = 10

// Color utilities
export const getStakingColor = (
  getThemeValue: (key: string) => string,
  staking: boolean,
  inPoolOnly: boolean
): string => {
  if (!staking) {
    return getThemeValue('--accent-color-transparent')
  }
  return !inPoolOnly
    ? getThemeValue('--accent-color-primary')
    : getThemeValue('--accent-color-secondary')
}

export const getPrimaryColor = (
  getThemeValue: (key: string) => string
): string => getThemeValue('--accent-color-primary')

export const getSecondaryColor = (
  getThemeValue: (key: string) => string
): string => getThemeValue('--accent-color-secondary')

// Shared spinner style for syncing state
export const SYNCING_SPINNER_STYLE = {
  position: 'absolute' as const,
  right: '3rem',
  top: '-4rem',
}
