// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface GenerateNominationsInnerProps {
  setters: Array<any>;
  nominations: string[];
  batchKey: string;
}

export type Nominations = string[];

export interface SetControllerProps {
  section: number;
}

export interface ChooseNominationsProps {
  section: number;
}

export interface SummaryProps {
  section: number;
}

export interface PayeeProps {
  section: number;
}

export interface BondProps {
  section: number;
}
