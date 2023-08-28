// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolRoles } from 'contexts/Pools/types';

export interface RolesProps {
  batchKey: string;
  defaultRoles: PoolRoles;
  listenIsValid?: any;
  setters?: any;
  inline?: boolean;
}

export type RoleEditEntry = {
  oldAddress: string;
  newAddress: string;
  valid: boolean;
  reformatted: boolean;
};
