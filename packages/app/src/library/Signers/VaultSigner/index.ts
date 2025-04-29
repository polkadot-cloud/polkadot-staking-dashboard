// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  VaultPromptHandlers,
  VaultSignatureResult,
  VaultSignStatus,
} from './types'

export class VaultSigner {
  #promptHandlers: VaultPromptHandlers

  constructor(promptHandlers: VaultPromptHandlers) {
    this.#promptHandlers = promptHandlers
  }

  #showPrompt = (toSign: Uint8Array): Promise<VaultSignatureResult> =>
    new Promise((resolve) => {
      const handleComplete = (
        status: VaultSignStatus,
        result: VaultSignatureResult
      ) => {
        this.#promptHandlers.closePrompt()
        if (status === 'cancelled') {
          this.#promptHandlers.setSubmitting(false)
          resolve(null)
        } else {
          resolve(result)
        }
      }
      this.#promptHandlers.openPrompt((status, signature) => {
        handleComplete(status, signature)
      }, toSign)
    })

  async sign(payload: Uint8Array): Promise<`0x${string}`> {
    // Start flow to sign QR Code here
    const signature = await this.#showPrompt(payload)

    if (signature === null) {
      throw 'Invalid signature'
    }
    return signature
  }
}
