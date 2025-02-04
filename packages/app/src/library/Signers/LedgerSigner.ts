// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { merkleizeMetadata } from '@polkadot-api/merkleize-metadata'
import { createV4Tx, getSignBytes } from '@polkadot-api/signers-common'
import type { V15 } from '@polkadot-api/substrate-bindings'
import { decAnyMetadata } from '@polkadot-api/substrate-bindings'
import type { PolkadotSigner } from 'polkadot-api'
import { mergeUint8 } from 'polkadot-api/utils'
import { Ledger } from '../../contexts/LedgerHardware/static/ledger'
import { getExtraSignedExtensions } from './util'

export class LedgerSigner {
  #publicKey: Uint8Array
  #txMetadataChainId: string

  constructor(pubKey: Uint8Array, txMetadataChainId: string) {
    this.#publicKey = pubKey
    this.#txMetadataChainId = txMetadataChainId
  }

  async getPolkadotSigner(
    networkInfo: { decimals: number; tokenSymbol: string },
    index: number
  ): Promise<PolkadotSigner> {
    const { app } = await Ledger.initialise(this.#txMetadataChainId)

    const signTx: PolkadotSigner['signTx'] = async (
      callData,
      signedExtensions,
      metadata
    ) => {
      const merkleizer = merkleizeMetadata(metadata, networkInfo)
      const digest = merkleizer.digest()
      const v15 = decAnyMetadata(metadata).metadata.value as unknown as V15
      const { extra, additionalSigned } = getExtraSignedExtensions(
        v15,
        digest,
        signedExtensions,
        true
      )

      const toSign = mergeUint8(callData, ...extra, ...additionalSigned)
      const { signature } = await Ledger.signPayload(
        app,
        index,
        toSign,
        merkleizer.getProofForExtrinsicPayload(toSign)
      )
      return createV4Tx(v15, this.#publicKey, signature, extra, callData)
    }

    return {
      publicKey: this.#publicKey,
      signTx,
      signBytes: getSignBytes(async (x) => {
        const { signature } = await Ledger.signPayload(app, index, x)
        // NOTE: the signature includes a "0x00" at the beginning, indicating a ed25519 signature.
        // this is not needed for non-extrinsic signatures.
        return signature.subarray(1)
      }),
    }
  }
}
