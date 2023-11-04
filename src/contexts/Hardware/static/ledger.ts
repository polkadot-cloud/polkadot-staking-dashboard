// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import type { AnyJson } from '@polkadot-cloud/react/types';
import { newSubstrateApp, type SubstrateApp } from '@zondax/ledger-substrate';
import type { AnyFunction } from 'types';
import {
  LEDGER_DEFAULT_ACCOUNT,
  LEDGER_DEFAULT_CHANGE,
  LEDGER_DEFAULT_INDEX,
} from '../defaults';

export class Ledger {
  // The ledger device transport. `null` when not actively in use.
  static transport: AnyJson | null;

  // Whether the device is currently paired.
  static isPaired: boolean = false;

  // Whether the device is currently executing a command.
  static isExecuting: boolean = false;

  // Initialise ledger transport, initialise app, and return with device info.
  static initialise = async (appName: string) => {
    this.transport = await TransportWebHID.create();
    const app = newSubstrateApp(Ledger.transport, appName);
    const { id, productName } = this.transport.device;
    return { app, id, productName };
  };

  // Ensure transport is closed.
  static ensureClosed = async () => {
    if (this.transport?.device?.opened) await this.transport?.close();
  };

  // Ensure transport is open.
  static ensureOpen = async () => {
    if (!this.transport?.device?.opened) await this.transport?.open();
  };

  // Get id and productName from transport. Ensure transport is initialised.
  static getDeviceInfo = async () => {
    const { id, productName } = this.transport.device;
    return { id, productName };
  };

  // Check if a response is an error
  static isError = (result: AnyJson) => {
    const error = result?.error_message;
    if (error) if (!error.startsWith('No errors')) return true;
    return false;
  };

  // Helper to time out a promise after a specified number of milliseconds.
  static withTimeout = (millis: number, promise: AnyFunction) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(async () => {
        // close transport on timeout.
        this.transport?.close();
        // reject promise with error.
        reject(Error('Timeout'));
      }, millis)
    );
    return Promise.race([promise, timeout]);
  };

  // Gets an address from transport.
  static getAddress = async (app: SubstrateApp, index: number) => {
    await this.ensureOpen();
    const result = await this.withTimeout(
      3000,
      app.getAddress(
        LEDGER_DEFAULT_ACCOUNT + index,
        LEDGER_DEFAULT_CHANGE,
        LEDGER_DEFAULT_INDEX + 0,
        false
      )
    );
    await this.ensureClosed();
    return result;
  };
}
