// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
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
