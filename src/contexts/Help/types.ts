// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';
import { MaybeString } from 'types';

export type HelpExternals = Array<HelpExternal>;

export type HelpDefinitions = Array<HelpDefinition>;

export type HelpDefinition = {
  title: string;
  description: string[];
};

export type HelpRecords = Array<HelpRecord>;

export type HelpRecord = {
  key: string;
  localeKey: string;
};

// TODO: update external type
export interface HelpExternal {
  title: string;
  url: string;
  website?: string;
}

export interface HelpContextInterface {
  openHelpWith: (d: MaybeString, c: HelpConfig) => void;
  closeHelp: () => void;
  setStatus: (s: number) => void;
  setDefinition: (d: MaybeString) => void;
  fillDefinitionVariables: (d: HelpDefinition) => HelpDefinition;
  status: number;
  definition: MaybeString;
}

export interface HelpContextState {
  status: number;
  definition: MaybeString;
  config: HelpConfig;
}

export interface HelpContextProps {
  children: ReactNode;
}

export type HelpConfig = Record<string, string | any>;
