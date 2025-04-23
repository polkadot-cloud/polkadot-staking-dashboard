// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PalletIdentityJudgement } from 'dedot/chaintypes'
import type { Data } from 'dedot/codecs'
import type { AnyJson } from './common'

export type IdentityOf = (
  | {
      info: {
        display: Data
      }
      judgements: [number, PalletIdentityJudgement][]
      deposit: bigint
    }
  | undefined
)[]

export interface Identity {
  deposit: string
  info: AnyJson
  judgements: AnyJson[]
}

export interface SuperIdentity {
  identity: Identity
  superOf: [string, { Raw: string }]
}
