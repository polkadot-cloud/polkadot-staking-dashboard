// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';

export interface MembersListProps {
  pagination: boolean;
  batchKey: string;
  selectToggleable?: boolean;
}

export type DefaultMembersListProps = MembersListProps & {
  members: AnyJson;
};

export type FetchpageMembersListProps = MembersListProps & {
  memberCount: string;
};
