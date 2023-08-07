// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyMetaBatch } from 'types';

export interface IdentitiesContextInterface {
  fetchIdentitiesMetaBatch: (k: string, v: string[], r?: boolean) => void;
  meta: AnyMetaBatch;
}
