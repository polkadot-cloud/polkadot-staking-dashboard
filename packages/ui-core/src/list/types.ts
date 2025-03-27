// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'

export type GraphProps = ComponentBase & {
  syncing: boolean
  canvas?: boolean
}

export type CheckboxProps = ComponentBase & {
  onClick: () => void
  checked: boolean
}

export type HeaderButtonProps = ComponentBase & {
  outline?: boolean
  withText?: boolean
  noMargin?: boolean
}

export type LabelRowProps = ComponentBase & {
  inline?: boolean
}
