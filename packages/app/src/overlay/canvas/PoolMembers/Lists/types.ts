// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface MembersListProps {
  pagination: boolean
  itemsPerPage: number
  batchKey: string
  selectToggleable?: boolean
  memberCount: string
}
