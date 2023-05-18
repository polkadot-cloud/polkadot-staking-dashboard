// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyApi } from 'types';

export interface AccountInputProps {
  successCallback: (a: string) => Promise<AnyApi>;
  defaultLabel: string;
  resetOnSuccess?: boolean;
  successLabel?: string;
  locked?: boolean;
  inactive?: boolean;
}
