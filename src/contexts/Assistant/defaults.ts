// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Toggle } from 'types';
import {
  AssistantContextInterface,
  AssistantDefinition,
} from 'contexts/Assistant/types';

export const definition: AssistantDefinition = {
  title: '',
  description: [],
};

export const defaultAssistantContext: AssistantContextInterface = {
  // eslint-disable-next-line
  fillDefinitionVariables: (d) => definition,
  toggle: () => {},
  // eslint-disable-next-line
  setPage: (page) => {},
  // eslint-disable-next-line
  setInnerDefinition: (meta) => {},
  // eslint-disable-next-line
  getDefinition: (k, t) => undefined,
  openAssistant: () => {},
  closeAssistant: () => {},
  // eslint-disable-next-line
  setActiveSection: (i) => {},
  // eslint-disable-next-line
  goToDefinition: (k, t) => {},
  // eslint-disable-next-line
  setAssistantHeight: (v) => {},
  activeSection: 0,
  open: Toggle.Closed,
  page: 'overview',
  innerDefinition: definition,
  height: 0,
  transition: 0,
};
