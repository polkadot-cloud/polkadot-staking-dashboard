// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolListContextProps } from './types';

export const defaultListFormat = 'col';

export const defaultPoolList: PoolListContextProps = {
  // eslint-disable-next-line
  setListFormat: (v) => {},
  listFormat: defaultListFormat,
};
