// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from 'types';

export interface AccountInputProps {
  successCallback: (a: string) => Promise<boolean>;
}

export interface ProxyInputProps {
  successCallback: (a: string, b: string) => Promise<AnyJson[]>;
}
