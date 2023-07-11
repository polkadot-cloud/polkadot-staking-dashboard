// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PoolListContextProps } from './types';

export const defaultListFormat = 'col';

export const defaultPoolList: PoolListContextProps = {
  // eslint-disable-next-line
  setListFormat: (v) => {},
  listFormat: defaultListFormat,
};
