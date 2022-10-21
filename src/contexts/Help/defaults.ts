// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HelpContextInterface, HelpDefinition } from './types';

export const definition: HelpDefinition = {
  title: '',
  description: [],
};

export const defaultHelpContext: HelpContextInterface = {
  // eslint-disable-next-line
  openHelpWith: (d, c) => {},
  closeHelp: () => {},
  // eslint-disable-next-line
  setStatus: (s) => {},
  // eslint-disable-next-line
  setDefinition: (d) => {},
  // eslint-disable-next-line
  fillDefinitionVariables: (d) => definition,
  status: 0,
  definition: null,
};
