// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Client } from 'smoldot'
import {
  type ClientOptionsWithBytecode,
  type SmoldotBytecode,
  startWithBytecode,
} from 'smoldot/no-auto-bytecode'

export type SmoldotOptions = Omit<
  ClientOptionsWithBytecode,
  'bytecode' | 'portToWorker'
>

export const startFromWorker = (
  worker: Worker,
  options: SmoldotOptions = {}
): Client => {
  const bytecode = new Promise<SmoldotBytecode>((resolve) => {
    worker.onmessage = (event) => resolve(event.data)
  })

  const { port1, port2 } = new MessageChannel()
  worker.postMessage(port1, [port1])

  return startWithBytecode({
    bytecode,
    portToWorker: port2,
    ...options,
  })
}
