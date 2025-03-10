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
