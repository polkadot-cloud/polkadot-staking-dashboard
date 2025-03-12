// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ExtensionArrayListItem } from '@w3ux/extension-assets/util'

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
