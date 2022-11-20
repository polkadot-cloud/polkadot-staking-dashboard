// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SetupType } from 'contexts/UI/types';

export interface NominationsProps {
  batchKey: string;
  setupType: SetupType;
  section: number;
}

export interface FooterProps {
  complete: boolean;
  setupType: SetupType;
}

export interface GenerateNominationsInnerProps {
  setters: Array<any>;
  nominations: string[];
  batchKey: string;
}

export interface HeaderProps {
  title?: string | null;
  helpKey?: string;
  complete?: boolean | null;
  thisSection: number;
  setupType: SetupType;
}

export type Nominations = string[];

export interface SetupStepProps {
  section: number;
}
