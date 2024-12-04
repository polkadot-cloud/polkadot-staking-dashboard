// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from '@w3ux/types'

export type RowSectionProps = ComponentBase & {
  // The CSS order of the component for vertical layouts.
  vLast?: boolean
  // `true` means padding on the left and false means padding on the right.
  hLast?: boolean
  // `true` means the secondary element and  false means the primary one.
  secondary?: boolean
}
