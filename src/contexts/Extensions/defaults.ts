// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ExtensionsContextInterface } from './types';

export const defaultExtensionsContext: ExtensionsContextInterface = {
  extensions: [],
  extensionsStatus: {},
  extensionsFetched: false,
  // eslint-disable-next-line
  setExtensionStatus: (id, s) => {},
  // eslint-disable-next-line
  setExtensionsFetched: (s) => {},
  // eslint-disable-next-line
  setExtensions: (s) => {},
};
