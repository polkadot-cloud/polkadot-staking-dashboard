// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'
import type { ReactNode } from 'react'

export type HardwareAddressProps = ComponentBase & {
  network: string
  address: string
  index: number
  initial: string
  disableEditIfImported?: boolean
  allowAction?: boolean
  Identicon: ReactNode
  renameHandler: (address: string, newName: string) => void
  existsHandler: (network: string, address: string) => boolean
  onRemove: (address: string) => void
  onConfirm: (address: string, index: number) => void
  last?: boolean
}
