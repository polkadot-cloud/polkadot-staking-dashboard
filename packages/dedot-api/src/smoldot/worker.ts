// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { compileBytecode } from 'smoldot/bytecode'
import * as smoldot from 'smoldot/worker'

// Based on the example from smoldot from worker documentation at:
// <https://github.com/smol-dot/smoldot/tree/main/wasm-node/javascript#usage-with-a-worker>
compileBytecode().then((d) => {
  postMessage(d)
})
onmessage = ({ data }) => smoldot.run(data)
