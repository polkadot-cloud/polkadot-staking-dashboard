// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createV4Tx, getSignBytes } from '@polkadot-api/signers-common'
import type { V15 } from '@polkadot-api/substrate-bindings'
import {
  Binary,
  compact,
  decAnyMetadata,
} from '@polkadot-api/substrate-bindings'
import type { PolkadotSigner } from 'polkadot-api'
import { mergeUint8 } from 'polkadot-api/utils'
import type {
  VaultPromptHandlers,
  VaultSignatureResult,
  VaultSignStatus,
} from './types'

export class VaultSigner {
  #publicKey: Uint8Array
  #promptHandlers: VaultPromptHandlers

  constructor(pubKey: Uint8Array, promptHandlers: VaultPromptHandlers) {
    this.#publicKey = pubKey
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

  async getPolkadotSigner(): Promise<PolkadotSigner> {
    const signTx: PolkadotSigner['signTx'] = async (
      callData,
      signedExtensions,
      metadata
    ) => {
      const v15 = decAnyMetadata(metadata).metadata.value as unknown as V15
      const extra: Uint8Array[] = []
      const additionalSigned: Uint8Array[] = []
      v15.extrinsic.signedExtensions.map(({ identifier }) => {
        const signedExtension = signedExtensions[identifier]
        if (!signedExtension) {
          throw new Error(`Missing ${identifier} signed extension`)
        }
        extra.push(signedExtension.value)
        additionalSigned.push(signedExtension.additionalSigned)
      })

      // The byte length is required as a prefix here.
      const prefix = compact.enc(callData.length)
      const toSign = mergeUint8(prefix, callData, ...extra, ...additionalSigned)

      // Start flow to sign QR Code here.
      const signature = await this.#showPrompt(toSign)

      if (signature === null) {
        throw 'Invalid signature'
      }
      return createV4Tx(
        v15,
        this.#publicKey,
        Binary.fromHex(signature).asBytes(),
        extra,
        callData
      )
    }

    return {
      publicKey: this.#publicKey,
      signTx,
      signBytes: getSignBytes(async (x) => {
        const signatureHex = await this.#showPrompt(x)
        if (!signatureHex) {
          throw 'Invalid signature'
        }
        // NOTE: the signature includes a "0x00" at the beginning, indicating a ed25519 signature.
        // this is not needed for non-extrinsic signatures.
        return Binary.fromHex(signatureHex).asBytes().subarray(1)
      }),
    }
  }
}
