// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import type { ComponentBase } from 'types'

export type ItemProps = ComponentBase & {
  network: string
  address: string
  initial: string
  disableEditIfImported?: boolean
  allowAction?: boolean
  Identicon: ReactNode
  renameHandler: (address: string, newName: string) => void
  existsHandler: (network: string, address: string) => boolean
  onRemove: (address: string) => void
  last?: boolean
}
