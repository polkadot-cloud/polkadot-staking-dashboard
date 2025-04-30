// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { compileBytecode } from 'smoldot/bytecode'
import * as smoldot from 'smoldot/worker'

compileBytecode().then((x) => {
  postMessage(x)
})
onmessage = (msg) => smoldot.run(msg.data)
