// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { merkleizeMetadata } from '@polkadot-api/merkleize-metadata'
import { Ledger } from 'contexts/LedgerHardware/static/ledger'
import type { ExtraSignedExtension, SubmittableExtrinsic } from 'dedot'
import type { PayloadOptions } from 'dedot/types'
import type { HexString } from 'dedot/utils'
import { hexToU8a, u8aToHex } from 'dedot/utils'

export class LedgerSigner {
  constructor(
    public specName: string,
    public from: string,
    public extraSignedExtension: (
      specName: string,
      signerAddress: string,
      payloadOptions?: PayloadOptions
    ) => ExtraSignedExtension | undefined,
    public tx: SubmittableExtrinsic,
    public metadata: HexString
  ) {}

  async sign(
    info: {
      decimals: number
      tokenSymbol: string
      specName: string
      specVersion: number
      ss58: number
    },
    index: number
  ) {
    const { app } = await Ledger.initialise()

    const merkleizer = merkleizeMetadata(this.metadata, {
      decimals: info.decimals,
      tokenSymbol: info.tokenSymbol,
    })
    const extra = this.extraSignedExtension(this.specName, this.from, {
      metadataHash: u8aToHex(merkleizer.digest()),
    })

    if (!extra) {
      return
    }
    await extra.init()

    const toSign = extra.toRawPayload(this.tx.callHex).data
    const proof = u8aToHex(merkleizer.getProofForExtrinsicPayload(toSign))

    const signature = (
      await Ledger.signPayload(app, index, hexToU8a(toSign), hexToU8a(proof))
    ).signature
    return { signature: u8aToHex(signature), data: extra.data }
  }
}
