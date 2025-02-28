// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import type { MaybeString } from 'types';

export type HelpItems = HelpItem[];

export interface HelpItem {
  key?: string;
  definitions?: string[];
  external?: ExternalItems;
}

export type ExternalItems = ExternalItem[];
export type ExternalItem = [string, string, string];

export interface DefinitionWithKeys {
  title: string;
  description: string[];
}

export interface ExternalWithKeys {
  title: string;
  url: string;
  website?: string;
}

export type HelpStatus = 'closed' | 'open' | 'closing';

export interface HelpContextInterface {
  openHelp: (d: MaybeString) => void;
  closeHelp: () => void;
  setStatus: (s: HelpStatus) => void;
  setDefinition: (d: MaybeString) => void;
  status: HelpStatus;
  definition: MaybeString;
}

export interface HelpContextState {
  status: HelpStatus;
  definition: MaybeString;
}

export interface HelpContextProps {
  children: ReactNode;
}

export type HelpConfig = Record<string, string | string[]>;
