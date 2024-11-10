// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { HelpContextInterface } from './types';

export const defaultHelpContext: HelpContextInterface = {
  openHelp: (key) => {},
  closeHelp: () => {},
  setStatus: (status) => {},
  setDefinition: (definition) => {},
  status: 'closed',
  definition: null,
};
