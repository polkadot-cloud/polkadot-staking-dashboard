// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount } from '@w3ux/types'

export interface QrReaderProps {
  network: string
  ss58: number
  onSuccess: (account: ImportedAccount) => void
}
