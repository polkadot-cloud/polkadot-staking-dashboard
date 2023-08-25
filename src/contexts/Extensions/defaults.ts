// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ExtensionsContextInterface } from './types';

export const defaultExtensionsContext: ExtensionsContextInterface = {
  extensions: [],
  extensionsStatus: {},
  extensionsFetched: false,
  checkingInjectedWeb3: false,
  setExtensionStatus: (id, s) => {},
  setExtensionsFetched: (s) => {},
  setExtensions: (s) => {},
};
