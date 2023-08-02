// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Dispatch, SetStateAction } from 'react';
import type { PayeeConfig } from 'contexts/Setup/types';
import type { MaybeAccount } from 'types';

export interface PayeeInputProps {
  payee: PayeeConfig;
  account: MaybeAccount;
  setAccount: Dispatch<SetStateAction<MaybeAccount>>;
  handleChange: (a: MaybeAccount) => void;
}
