// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from 'types';

export interface AccountProps {
  value: MaybeAddress;
  label?: string;
  readOnly?: boolean;
}

export type PoolAccountProps = {
  pool: any;
  label: string;
  syncing: boolean;
};
