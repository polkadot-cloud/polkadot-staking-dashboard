// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Ledger } from 'contexts/LedgerHardware/static/ledger'
import type { HexString } from 'dedot/utils'
import { hexToU8a, u8aToHex } from 'dedot/utils'
import { init, RuntimeMetadata } from 'merkleized-metadata'

export class LedgerSignerNew {
  constructor(
    public txHex: HexString,
    public payload: Uint8Array,
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
    const runtimeMetadata = RuntimeMetadata.fromHex(this.metadata.slice(2))

    const digest = mm.generateMetadataDigest(runtimeMetadata, {
      base58Prefix: info.ss58,
      decimals: info.decimals,
      specName: info.specName,
      specVersion: info.specVersion,
      tokenSymbol: info.tokenSymbol,
    })
    console.log('Metadata Hash:', digest.hash())

    const proof = mm.generateProofForExtrinsic(
      this.txHex.slice(2),
      undefined,
      runtimeMetadata
    )

    const txMetadata = `0x${proof.encode()}`

    const signature = (
      await Ledger.signPayload(app, index, this.payload, hexToU8a(txMetadata))
    ).signature

    console.log('ledger signature', signature)
    return u8aToHex(signature)
  }
}
