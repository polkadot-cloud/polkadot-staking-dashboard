// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';

export interface PoomMembersEvent {
  network: string;
  key: string;
  pools: AnyJson[];
}
