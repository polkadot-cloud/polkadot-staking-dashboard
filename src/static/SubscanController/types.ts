// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from 'types';

export type PayoutType = 'payouts' | 'unclaimedPayouts' | 'poolClaims';

export type SubscanData = Partial<Record<PayoutType, AnyJson>>;
