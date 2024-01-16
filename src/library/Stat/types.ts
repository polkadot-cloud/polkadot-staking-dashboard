// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { AnyJson, MaybeAddress } from 'types';

export interface StatProps {
  label: string;
  stat: AnyJson;
  type?: string;
  buttons?: AnyJson[];
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
