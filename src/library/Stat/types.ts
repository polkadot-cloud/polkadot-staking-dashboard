// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MaybeAccount } from 'types';

export interface StatProps {
  label: string;
  stat: string | StatAddress;
  buttons?: any;
  helpKey: string;
  icon?: IconProp;
  copy?: {
    content: string;
    notification: {
      title: string;
      subtitle: string;
    };
  };
}

export interface StatAddress {
  address: MaybeAccount;
  display: string;
}
