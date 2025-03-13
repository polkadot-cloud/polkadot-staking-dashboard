// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util'
import type { ComponentBase } from '@w3ux/types'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

export interface InnerProps {
  installed: ExtensionArrayListItem[]
  other: ExtensionArrayListItem[]
  setOpen: Dispatch<SetStateAction<boolean>>
  selectedSection: string
}

export interface ExtensionProps {
  extension: ExtensionArrayListItem
  last: boolean
}

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
