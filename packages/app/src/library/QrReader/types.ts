// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

export interface QrReaderProps {
  network: string
  ss58: number
  importActive: boolean
  onSuccess: () => void
}
