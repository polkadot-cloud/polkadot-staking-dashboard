// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Toggle } from 'types';
import { AssistantDefinition } from 'types/assistant';

export const definition: AssistantDefinition = {
  title: '',
  description: [],
};

export const defaultAssistantContext = {
  // eslint-disable-next-line
  fillDefinitionVariables: (d: AssistantDefinition) => definition,
  toggle: () => {},
  // eslint-disable-next-line
  setPage: (page: string) => {},
  // eslint-disable-next-line
  setInnerDefinition: (meta: AssistantDefinition) => {},
  // eslint-disable-next-line
  getDefinition: (k: string, t: string) => undefined,
  openAssistant: () => {},
  closeAssistant: () => {},
  // eslint-disable-next-line
  setActiveSection: (i: number) => {},
  // eslint-disable-next-line
  goToDefinition: (k: string, t: string) => {},
  // eslint-disable-next-line
  setAssistantHeight: (v: number) => {},
  activeSection: 0,
  open: Toggle.Closed,
  page: 'overview',
  innerDefinition: definition,
  height: 0,
  transition: 0,
};
