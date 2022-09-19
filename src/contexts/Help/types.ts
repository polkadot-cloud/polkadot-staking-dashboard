// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';
import { Toggle } from '../../types';

export type AssistantConfig = Array<AssistantItem>;

export interface AssistantItem {
  key: string;
  definitions?: HelpDefinitions;
  external?: HelpExternals;
}

export type HelpExternals = Array<HelpExternal>;

export type HelpDefinitions = Array<HelpDefinition>;

export type HelpDefinition = {
  title: string;
  description: string[];
};

export interface HelpExternal {
  label: string;
  title: string;
  subtitle: string;
  url: string;
  website?: string;
}

export interface HelpContextInterface {
  fillDefinitionVariables: (d: HelpDefinition) => HelpDefinition;
  toggle: () => void;
  setPage: (page: string) => void;
  setInnerDefinition: (meta: HelpDefinition) => void;
  getDefinition: (k: string, t: string) => HelpDefinition | undefined;
  openHelp: () => void;
  closeHelp: () => void;
  setActiveSection: (i: number) => void;
  goToDefinition: (k: string, t: string) => void;
  setHelpHeight: (v: number) => void;
  activeSection: number;
  open: Toggle;
  page: string;
  innerDefinition: HelpDefinition;
  height: number;
  transition: number;
}

export interface HelpContextProps {
  children: ReactNode;
}
