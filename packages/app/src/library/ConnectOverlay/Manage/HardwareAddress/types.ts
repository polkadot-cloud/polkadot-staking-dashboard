// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
