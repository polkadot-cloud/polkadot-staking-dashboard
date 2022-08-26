// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PoolRoles } from 'contexts/Pools/types';

export interface RolesProps {
  batchKey: string;
  defaultRoles: PoolRoles;
  listenIsValid?: any;
  setters?: any;
  title?: string | undefined;
}

export type RoleEditEntry = {
  oldAddress: string;
  newAddress: string;
  valid: boolean;
  reformatted: boolean;
};
