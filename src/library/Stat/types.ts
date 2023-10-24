// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { AnyObject } from '@polkadot-cloud/utils/types';
import type { MaybeAddress } from 'types';

export interface StatProps {
  label: string;
  stat: AnyObject;
  type?: string;
  buttons?: any;
  helpKey: string;
  icon?: IconProp;
  buttonType?: string;
  copy?: {
    content: string;
    notification: {
      title: string;
      subtitle: string;
    };
  };
}

export interface StatAddress {
  address: MaybeAddress;
  display: string;
}
