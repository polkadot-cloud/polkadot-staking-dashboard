// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface MembersListProps {
  allowMoreCols: boolean;
  pagination: boolean;
  batchKey: string;
  disableThrottle?: boolean;
  selectToggleable?: boolean;
}

export type DefaultMembersListProps = MembersListProps & {
  members: any;
};

export type FetchpageMembersListProps = MembersListProps & {
  memberCount: number;
};
