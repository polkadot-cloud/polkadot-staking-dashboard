// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExternalAccount, ExtensionAccount } from 'contexts/Connect/types';
import { Balance } from 'contexts/Balances/types';

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
  items: Array<InputItem>;
  onChange: (o: any) => void;
  placeholder: string;
  value: InputItem;
  current: InputItem;
  height: string | number | undefined;
}

export interface AccountSelectProps {
  items: Array<InputItem>;
  onChange: (o: any) => void;
  placeholder: string;
  value: InputItem;
}

export interface BondFeedbackProps {
  setters: any;
  bondType: string;
  defaultBond: number | null;
  inSetup?: boolean;
  listenIsValid: { (v: boolean): void } | { (): void };
  warnings?: string[];
  disableTxFeeUpdate?: boolean;
  setLocalResize?: () => void;
}

export interface BondInputProps {
  setters: any;
  value: any;
  defaultValue: number | string;
  disabled: boolean;
  freeBalance: number;
  disableTxFeeUpdate?: boolean;
}

export interface UnbondFeedbackProps {
  setters: any;
  bondType: string;
  defaultBond: number | null;
  inSetup?: boolean;
  listenIsValid: { (v: boolean): void } | { (): void };
  warnings?: string[];
  disableTxFeeUpdate?: boolean;
  setLocalResize?: () => void;
}

export interface UnbondInputProps {
  freeToUnbondToMin: number;
  defaultValue: number | string;
  disabled: boolean;
  setters: any;
  value: any;
}

export interface NominateStatusBarProps {
  value: number;
}

export interface DropdownProps {
  items: Array<DropdownInput>;
  onChange: (o: any) => void;
  label?: string;
  placeholder: string;
  value: DropdownInput;
  current: DropdownInput;
  height: string;
}

export interface WarningProps {
  text: string;
}
