// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi, MaybeAddress } from 'types';

export interface AccountInputProps {
  successCallback: (a: string) => Promise<AnyApi>;
  resetCallback?: () => void;
  defaultLabel: string;
  resetOnSuccess?: boolean;
  successLabel?: string;
  locked?: boolean;
  inactive?: boolean;
  disallowAlreadyImported?: boolean;
  initialValue?: MaybeAddress;
  border?: boolean;
}
