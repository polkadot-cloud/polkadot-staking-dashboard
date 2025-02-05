// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'

export interface Identity {
  deposit: string
  info: AnyJson
  judgements: AnyJson[]
}

export interface SuperIdentity {
  identity: Identity
  superOf: [string, { Raw: string }]
}
