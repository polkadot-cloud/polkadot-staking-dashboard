// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolRoles } from 'contexts/Pools/ActivePools/types';
import type { AnyFunction } from 'types';

export interface RolesProps {
  batchKey: string;
  defaultRoles: PoolRoles;
  listenIsValid?: AnyFunction;
  setters?: AnyFunction;
  inline?: boolean;
}

export interface RoleEditEntry {
  oldAddress: string;
  newAddress: string;
  valid: boolean;
  reformatted: boolean;
}

export interface RoleEditInputProps {
  roleKey: string;
  roleEdit: RoleEditEntry;
  setRoleEdit: (role: string, edit: RoleEditEntry) => void;
}
