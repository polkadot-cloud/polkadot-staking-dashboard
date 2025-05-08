// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface InviteNotificationContextInterface {
  inviteActive: boolean
  inviteType: InviteType | undefined
  inviteData: Record<string, string>
  setInviteActive: (active: boolean) => void
  setInviteType: (type: InviteType | undefined) => void
  setInviteData: (data: Record<string, string>) => void
  dismissInvite: () => void
  navigateToInvite: () => void
  acknowledged: boolean
  setAcknowledged: (acknowledged: boolean) => void
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
