// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { SubscanContextInterface } from './types';

export const defaultSubscanContext: SubscanContextInterface = {
  fetchEraPoints: (v, e) => new Promise((resolve) => resolve({})),
};
