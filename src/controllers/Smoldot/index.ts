// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AddChainOptions, Client } from '@polkadot-api/smoldot';
import { startFromWorker } from '@polkadot-api/smoldot/from-worker';

// A class to manage the Smoldot worker.
export class SmoldotController {
  static smoldot: Client | undefined = undefined;

  // Initialise the Smoldot worker.
  static initialise() {
    // If the worker is already initialised, return.
    if (this.smoldot) {
      return;
    }

    this.smoldot = startFromWorker(
      new Worker(new URL('@polkadot-api/smoldot/worker', import.meta.url), {
        type: 'module',
      })
    );
  }

  // Add a chain to the Smoldot worker.
  static addChain({ chainSpec }: AddChainOptions) {
    if (!this.smoldot) {
      this.initialise();
    }
    return this.smoldot!.addChain({ chainSpec });
  }

  // Disconnect the Smoldot worker.
  static terminate() {
    this.smoldot?.terminate();
    this.smoldot = undefined;
  }
}
