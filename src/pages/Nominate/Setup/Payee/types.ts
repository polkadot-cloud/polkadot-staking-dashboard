// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { PayeeConfig, PayeeOptions } from 'contexts/Setup/types';
import { Dispatch, SetStateAction } from 'react';
import { MaybeAccount } from 'types';

export interface PayeeItem {
  icon: IconProp;
  value: PayeeOptions;
  title: string;
  activeTitle: string;
  subtitle: string;
}

export interface AccountInputProps {
  payee: PayeeConfig;
  account: MaybeAccount;
  setAccount: Dispatch<SetStateAction<MaybeAccount>>;
  handleChange: (a: MaybeAccount) => void;
}
