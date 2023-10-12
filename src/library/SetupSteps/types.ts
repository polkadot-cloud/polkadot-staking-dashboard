// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Validator } from 'contexts/Validators/types';
import type { AnyFunction, BondFor } from 'types';

export interface NominationsProps {
  batchKey: string;
  bondFor: BondFor;
  section: number;
}

export interface FooterProps {
  complete: boolean;
  bondFor: BondFor;
}

export interface GenerateNominationsProps {
  setters: AnyFunction[];
  nominations: Validator[];
  batchKey: string;
  inOverlay?: boolean;
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
