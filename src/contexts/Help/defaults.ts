// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HelpContextInterface } from './types';

export const defaultHelpContext: HelpContextInterface = {
  // eslint-disable-next-line
  openHelp: (key) => {},
  closeHelp: () => {},
  // eslint-disable-next-line
  setStatus: (status) => {},
  // eslint-disable-next-line
  setDefinition: (definition) => {},
  status: 0,
  definition: null,
};
