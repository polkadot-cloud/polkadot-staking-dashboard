// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { HexString } from 'dedot/utils'

export interface VaultPromptHandlers {
  openPrompt: (
    onComplete: (
      status: 'complete' | 'cancelled',
      result: HexString | null
    ) => void,
    toSign: Uint8Array
  ) => void
  closePrompt: () => void
  setSubmitting: (submitting: boolean) => void
}

export type VaultSignStatus = 'complete' | 'cancelled'

export type VaultSignatureResult = HexString | null
