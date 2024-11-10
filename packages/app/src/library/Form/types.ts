// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { Balance } from 'contexts/Balances/types';
import type {
  ExtensionAccount,
  ExternalAccount,
} from '@w3ux/react-connect-kit/types';
import type { BondFor, MaybeAddress } from 'types';
import type { ClaimPermission } from 'contexts/Pools/types';

export interface ExtensionAccountItem extends ExtensionAccount {
  active?: boolean;
  alert?: string;
  balance?: Balance;
}
export interface ExternalAccountItem extends ExternalAccount {
  active?: boolean;
  alert?: string;
  balance?: Balance;
}
export type ImportedAccountItem = ExtensionAccountItem | ExternalAccountItem;

export type InputItem = ImportedAccountItem | null;

export interface DropdownInput {
  key: string;
  name: string;
}

export interface AccountDropdownProps {
  current: InputItem;
  to: MaybeAddress;
}

export type BondSetter = ({ bond }: { bond: BigNumber }) => void;

export interface BondFeedbackProps {
  syncing?: boolean;
  setters: BondSetter[];
  bondFor: BondFor;
  defaultBond: string | null;
  inSetup?: boolean;
  joiningPool?: boolean;
  listenIsValid?: ((valid: boolean, errors: string[]) => void) | (() => void);
  parentErrors?: string[];
  disableTxFeeUpdate?: boolean;
  setLocalResize?: () => void;
  txFees: BigNumber;
  maxWidth?: boolean;
  displayFirstWarningOnly?: boolean;
}

export interface BondInputProps {
  freeToBond: BigNumber;
  value: string;
  defaultValue: string;
  syncing?: boolean;
  setters: BondSetter[];
  disabled: boolean;
  disableTxFeeUpdate?: boolean;
}

export interface UnbondFeedbackProps {
  setters: BondSetter[];
  bondFor: BondFor;
  defaultBond?: number;
  inSetup?: boolean;
  listenIsValid?: ((valid: boolean, errors: string[]) => void) | (() => void);
  parentErrors?: string[];
  setLocalResize?: () => void;
  txFees: BigNumber;
  displayFirstWarningOnly?: boolean;
}

export interface UnbondInputProps {
  active: BigNumber;
  unbondToMin: BigNumber;
  defaultValue: string;
  disabled: boolean;
  setters: BondSetter[];
  value: string;
}

export interface NominateStatusBarProps {
  value: BigNumber;
}

export interface WarningProps {
  text: string;
}

// PoolMembers types
export interface ClaimPermissionConfig {
  label: string;
  value: ClaimPermission;
  description: string;
}
