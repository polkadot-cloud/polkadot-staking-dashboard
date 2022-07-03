// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExternalAccount } from 'contexts/Connect/types';
import { WalletAccount } from '@talisman-connect/wallets';
import { Balance } from 'contexts/Balances/types';

export interface WalletAccountItem extends WalletAccount {
  active?: boolean;
  alert?: string;
  balance?: Balance;
}
export interface ExternalAccountItem extends ExternalAccount {
  active?: boolean;
  alert?: string;
  balance?: Balance;
}
export type ImportedAccountItem = WalletAccountItem | ExternalAccountItem;

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

export interface BondInputProps {
  setters: any;
  value: any;
  task: string;
  defaultValue: number;
  disabled: boolean;
  freeToBond: number;
  freeToUnbondToMin: number;
}

export interface BondInputWithFeedbackProps {
  setters: any;
  bondType: string;
  defaultBond: number;
  unbond: boolean;
  nominating?: boolean;
  listenIsValid: { (v: boolean): void } | { (): void };
  warnings?: string[];
}

export interface BondStatusBarProps {
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
