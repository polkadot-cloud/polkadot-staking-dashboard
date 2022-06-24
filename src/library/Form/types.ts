// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ImportedAccount } from 'types/connect';

export type InputItem = ImportedAccount | null;

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
  items: Array<ImportedAccount>;
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
  listenIsValid: boolean;
  warnings?: Array<string>;
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
