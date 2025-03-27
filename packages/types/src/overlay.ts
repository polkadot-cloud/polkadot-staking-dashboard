// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type OverlayInstanceDirection = 'inc' | 'dec'

export type ActiveOverlayInstance = 'modal' | 'canvas' | null

export type OverlayType = 'modal' | 'canvas'

export type CanvasStatus = 'open' | 'closing' | 'closed'

export type ModalStatus =
  | 'opening'
  | 'open'
  | 'closing'
  | 'closed'
  | 'replacing'

export type ModalSize = 'xs' | 'sm' | 'lg' | 'xl'

export type CanvasSize = 'lg' | 'xl'
