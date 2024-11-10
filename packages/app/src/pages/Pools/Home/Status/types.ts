// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface StatusProps {
  height: number;
}

export interface MembershipStatusProps {
  showButtons?: boolean;
  buttonType?: string;
}

export interface NewMemberProps {
  syncing: boolean;
}
