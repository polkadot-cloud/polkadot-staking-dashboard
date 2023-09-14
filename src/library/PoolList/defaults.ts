// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PoolListContextProps } from './types';

export const defaultListFormat = 'col';

export const defaultPoolList: PoolListContextProps = {
  setListFormat: (v) => {},
  listFormat: defaultListFormat,
};
