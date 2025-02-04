// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import type { AnyJson } from '@w3ux/types'
import { withTimeout } from '@w3ux/utils'
import { PolkadotGenericApp } from '@zondax/ledger-substrate'

export class Ledger {
  // The ledger device transport. `null` when not actively in use
  static transport: AnyJson | null

  // Whether the device is currently paired
  static isPaired = false

  // Initialise ledger transport, initialise app, and return with device info
  static initialise = async (txMetadataChainId: string) => {
    this.transport = await TransportWebHID.create()
    const app = new PolkadotGenericApp(Ledger.transport, txMetadataChainId)
    const { productName } = this.transport.device
    return { app, productName }
  }

  // Ensure transport is closed
  static ensureClosed = async () => {
    if (this.transport?.device?.opened) {
      await this.transport?.close()
    }
  }

  // Ensure transport is open
  static ensureOpen = async () => {
    if (!this.transport?.device?.opened) {
      await this.transport?.open()
    }
  }

  // Gets device runtime version
  static getVersion = async (app: PolkadotGenericApp) => {
    await this.ensureOpen()
    const result = await withTimeout(3000, app.getVersion(), {
      onTimeout: () => this.transport?.close(),
    })
    await this.ensureClosed()
    return result
  }

  // Gets an address from transport
  static getAddress = async (
    app: PolkadotGenericApp,
    index: number,
    ss58Prefix: number
  ) => {
    await this.ensureOpen()

    const bip42Path = `m/44'/354'/${index}'/${0}'/${0}'`

    const result = await withTimeout(
      3000,
      app.getAddress(bip42Path, ss58Prefix, false),
      {
        onTimeout: () => this.transport?.close(),
      }
    )
    await this.ensureClosed()
    return result
  }

  // Signs a payload on device
  static signPayload = async (
    app: PolkadotGenericApp,
    index: number,
    payload: Uint8Array,
    txMetadata?: Uint8Array
  ) => {
    await this.ensureOpen()

    const bip42Path = `m/44'/354'/${index}'/${0}'/${0}'`
    const toSign = Buffer.from(payload)

    let result
    if (txMetadata) {
      const buff = Buffer.from(txMetadata)
      result = await app.signWithMetadata(bip42Path, toSign, buff)
    } else {
      result = app.sign(bip42Path, toSign)
    }

    await this.ensureClosed()
    return result
  }

  // Reset ledger on unmount
  static unmount = async () => {
    await this.transport?.close()
    this.transport = null
    this.isPaired = false
  }
}
