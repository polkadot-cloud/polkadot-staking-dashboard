// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors

import BN from 'bn.js';
import { ROLES } from 'config/accounts';

export type Address = string | undefined;
export type AccountRole = string | undefined;

export const isRoleValid = (_role: AccountRole): boolean => {
  if (!_role) return false;
  return ROLES.indexOf(_role) !== -1;
};

export interface AccountContextInterface {
  address: Address;
  role: AccountRole;
  balance: BN;
  update: () => void;
}
