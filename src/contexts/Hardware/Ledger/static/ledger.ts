// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import type { AnyJson } from '@polkadot-cloud/react/types';
import { newSubstrateApp, type SubstrateApp } from '@zondax/ledger-substrate';
import { withTimeout } from '@polkadot-cloud/utils';
import { u8aToBuffer } from '@polkadot/util';

const LEDGER_DEFAULT_ACCOUNT = 0x80000000;
const LEDGER_DEFAULT_CHANGE = 0x80000000;
const LEDGER_DEFAULT_INDEX = 0x80000000;

export class Ledger {
  // The ledger device transport. `null` when not actively in use.
  static transport: AnyJson | null;

  // Whether the device is currently paired.
  static isPaired = false;

  // Initialise ledger transport, initialise app, and return with device info.
  static initialise = async (appName: string) => {
    this.transport = await TransportWebHID.create();
    const app = newSubstrateApp(Ledger.transport, appName);
    const { productName } = this.transport.device;
    return { app, productName };
  };

  // Ensure transport is closed.
  static ensureClosed = async () => {
    if (this.transport?.device?.opened) {
      await this.transport?.close();
    }
  };

  // Ensure transport is open.
  static ensureOpen = async () => {
    if (!this.transport?.device?.opened) {
      await this.transport?.open();
    }
  };

  // Check if a response is an error.
  static isError = (result: AnyJson) => {
    const error = result?.error_message;
    if (error) {
      if (!error.startsWith('No errors')) {
        return true;
      }
    }
    return false;
  };

  // Gets device runtime version.
  static getVersion = async (app: SubstrateApp) => {
    await this.ensureOpen();
    const result = await withTimeout(3000, app.getVersion(), {
      onTimeout: () => this.transport?.close(),
    });
    await this.ensureClosed();
    return result;
  };

  // Gets an address from transport.
  static getAddress = async (app: SubstrateApp, index: number) => {
    await this.ensureOpen();
    const result = await withTimeout(
      3000,
      app.getAddress(
        LEDGER_DEFAULT_ACCOUNT + index,
        LEDGER_DEFAULT_CHANGE,
        LEDGER_DEFAULT_INDEX + 0,
        false
      ),
      {
        onTimeout: () => this.transport?.close(),
      }
    );
    await this.ensureClosed();
    return result;
  };

  // Signs a payload on device.
  static signPayload = async (
    app: SubstrateApp,
    index: number,
    payload: AnyJson
  ) => {
    await this.ensureOpen();
    const result = await app.sign(
      LEDGER_DEFAULT_ACCOUNT + index,
      LEDGER_DEFAULT_CHANGE,
      LEDGER_DEFAULT_INDEX + 0,
      u8aToBuffer(payload.toU8a(true))
    );
    await this.ensureClosed();
    return result;
  };

  // Reset ledger on unmount.
  static unmount = async () => {
    await this.transport?.close();
    this.transport = null;
    this.isPaired = false;
  };
}
