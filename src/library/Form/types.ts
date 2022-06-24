// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WalletAccount } from '@talisman-connect/wallets';

export interface AccountDropdownProps {
  items: Array<WalletAccount>;
  onChange: (o: any) => void;
  placeholder: string;
  value: WalletAccount; // WalletAccount
  current: WalletAccount | null;
  height: string | number | undefined;
}

export interface AccountSelectProps {
  items: Array<WalletAccount>;
  onChange: (string: any) => void;
  placeholder: string;
  value: WalletAccount;
}

export interface BondInputProps {
  // setters: Array<{
  //   fn: () => void;
  //   val: T;
  // }>;
  setters: any;
  task: string;
  value: any;
  defaultValue: number;
  disabled: boolean;
  freeToBond: number;
  freeToUnbondToMin: number;
}

export interface BondInputWithFeedbackProps {
  bondType: string;
  defaultBond: number;
  unbond: boolean;
  nominating?: boolean;
  setters: any;
  listenIsValid: boolean;
  warnings?: Array<string>;
}

export interface BondStatusBarProps {
  value: number;
}

export interface DropdownProps {
  items: Array<any>;
  onChange: (string: any) => void;
  label?: string;
  placeholder: string;
  value: number;
  current: number;
  height: string;
}

export interface WarningProps {
  text: string;
}
