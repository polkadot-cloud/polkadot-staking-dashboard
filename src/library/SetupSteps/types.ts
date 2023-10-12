// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Validator } from 'contexts/Validators/types';
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
  setters: any[];
  nominations: Validator[];
  batchKey: string;
}

export interface HeaderProps {
  title?: string;
  helpKey?: string;
  complete?: boolean | null;
  thisSection: number;
  bondFor: BondFor;
}

export interface SetupStepProps {
  section: number;
}
