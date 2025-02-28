// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { EraUnclaimedPayouts } from 'contexts/Payouts/types';

export const getTotalPayout = (
  unclaimedPayout: EraUnclaimedPayouts
): BigNumber =>
  Object.values(unclaimedPayout).reduce(
    (acc: BigNumber, paginatedValidator: [number, string]) =>
      acc.plus(paginatedValidator[1]),
    new BigNumber(0)
  );
