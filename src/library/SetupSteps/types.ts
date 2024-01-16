// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import type { BondFor } from 'types';

export interface NominationsProps {
  bondFor: BondFor;
  section: number;
}

export interface FooterProps {
  complete: boolean;
  bondFor: BondFor;
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

export interface MotionContainerProps {
  thisSection: number;
  activeSection: number;
  children: ReactNode;
}
