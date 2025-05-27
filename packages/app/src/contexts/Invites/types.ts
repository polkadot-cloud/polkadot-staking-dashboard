// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface InvitesContextInterface {
  dismissInvite: () => void
  acknowledged: boolean
  setAcknowledged: (acknowledged: boolean) => void
  inviteConfig: InviteConfig | undefined
}

export type InviteType = 'pool' | 'validator'

export interface InviteConfig {
  type: InviteType
  network: string
  invite: PoolInvite | NominatorInvite
}

export type PoolInvite = {
  poolId: number
}
export type NominatorInvite = {
  validators: string
}
