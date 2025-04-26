// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Ledger } from 'contexts/LedgerHardware/static/ledger'
import type { ExtraSignedExtension, SubmittableExtrinsic } from 'dedot'
import type { PayloadOptions } from 'dedot/types'
import type { HexString } from 'dedot/utils'
import { hexAddPrefix, hexStripPrefix, hexToU8a, u8aToHex } from 'dedot/utils'
import { init, RuntimeMetadata } from 'merkleized-metadata'

export class LedgerSignerNew {
  constructor(
    public from: string,
    public extraSignedExtension: (
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

    const mm = await init()
    const runtimeMetadata = RuntimeMetadata.fromHex(
      hexStripPrefix(this.metadata)
    )
    const digest = mm.generateMetadataDigest(runtimeMetadata, {
      base58Prefix: info.ss58,
      decimals: info.decimals,
      specName: info.specName,
      specVersion: info.specVersion,
      tokenSymbol: info.tokenSymbol,
    })

    const extra = this.extraSignedExtension(this.from, {
      metadataHash: hexAddPrefix(`${digest.hash()}`),
    })

    if (!extra) {
      return
    }
    await extra.init()

    const additionalSigned = extra.$AdditionalSigned.tryEncode(
      extra.additionalSigned
    )
    const toSign = extra.toRawPayload(this.tx.callHex).data

    const proof = mm.generateProofForExtrinsic(
      hexStripPrefix(this.tx.toHex()),
      hexStripPrefix(u8aToHex(additionalSigned)),
      runtimeMetadata
    )

    console.log(`0x${proof.encode()}`)

    const signature = (
      await Ledger.signPayload(
        app,
        index,
        hexToU8a(toSign),
        hexToU8a(`0x${proof.encode()}`)
      )
    ).signature

    console.log('ledger signature', signature)
    return u8aToHex(signature)
  }
}
