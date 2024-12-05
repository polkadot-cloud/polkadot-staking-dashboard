// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface MembersListProps {
  pagination: boolean
  batchKey: string
  selectToggleable?: boolean
}

export type FetchpageMembersListProps = MembersListProps & {
  memberCount: string
}
