// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface QrReaderProps {
  network: string
  ss58: number
  importActive: boolean
  onSuccess: () => void
}
