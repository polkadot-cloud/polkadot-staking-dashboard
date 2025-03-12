// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util'
import type { ComponentBase } from '@w3ux/types'
import type { ReactNode } from 'react'

export interface InnerProps {
  installed: ExtensionArrayListItem[]
  other: ExtensionArrayListItem[]
}

export interface ExtensionProps {
  extension: ExtensionArrayListItem
  last: boolean
}

export interface ManageHardwareProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMotionProps: (item: string, active?: boolean) => any
  selectedConnectItem: string | undefined
}

export interface QrReaderProps {
  network: string
  ss58: number
  importActive: boolean
  onSuccess: () => void
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
