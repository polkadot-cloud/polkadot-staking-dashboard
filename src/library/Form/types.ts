// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { Balance } from 'contexts/Balances/types';
import type {
  ExtensionAccount,
  ExternalAccount,
} from '@polkadot-cloud/react/types';
import type { BondFor, MaybeAddress } from 'types';

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
