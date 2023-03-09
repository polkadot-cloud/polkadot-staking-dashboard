// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BondFor } from 'types';

export interface NominationsProps {
  batchKey: string;
  bondFor: BondFor;
  section: number;
}

export interface FooterProps {
  complete: boolean;
  bondFor: BondFor;
}

export interface GenerateNominationsInnerProps {
  setters: Array<any>;
  nominations: string[];
  batchKey: string;
}

export interface HeaderProps {
  title?: string;
  helpKey?: string;
  complete?: boolean | null;
  thisSection: number;
  bondFor: BondFor;
}

export type Nominations = string[];

export interface SetupStepProps {
  section: number;
}
