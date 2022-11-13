// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';
import { MaybeString } from 'types';

export type HelpItemLocales = Array<HelpItemLocale>;

export interface HelpItemLocale {
  key?: string;
  definitions?: HelpLocales;
  external?: ExternalLocales;
}

export type HelpExternals = Array<HelpExternal>;
export type ExternalLocales = Array<ExternalLocale>;

export type HelpDefinitions = Array<HelpDefinition>;
export type HelpLocales = Array<HelpLocale>;

export type HelpLocale = {
  key: string;
  localeKey: string;
};

export type HelpDefinition = {
  title: string;
  description: string[];
};

export interface ExternalLocale {
  localeKey: string;
  url: string;
  website?: string;
}
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
