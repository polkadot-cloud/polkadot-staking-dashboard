// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';
import { Toggle } from '../../types';

export type AssistantConfig = Array<AssistantItem>;

export interface AssistantItem {
  key: string;
  definitions?: AssistantDefinitions;
  external?: AssistantExternals;
}

export type AssistantExternals = Array<AssistantExternal>;

export type AssistantDefinitions = Array<AssistantDefinition>;

export type AssistantDefinition = {
  title: string;
  description: string[];
};

export interface AssistantExternal {
  label: string;
  title: string;
  subtitle: string;
  url: string;
  website?: string;
}

export interface AssistantContextInterface {
  fillDefinitionVariables: (d: AssistantDefinition) => AssistantDefinition;
  toggle: () => void;
  setPage: (page: string) => void;
  setInnerDefinition: (meta: AssistantDefinition) => void;
  getDefinition: (k: string, t: string) => AssistantDefinition | undefined;
  openAssistant: () => void;
  closeAssistant: () => void;
  setActiveSection: (i: number) => void;
  goToDefinition: (k: string, t: string) => void;
  setAssistantHeight: (v: number) => void;
  activeSection: number;
  open: Toggle;
  page: string;
  innerDefinition: AssistantDefinition;
  height: number;
  transition: number;
}

export interface AssistantContextProps {
  children: ReactNode;
}
