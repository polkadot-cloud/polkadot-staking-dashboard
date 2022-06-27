// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface StatProps {
  label: string;
  stat: string;
  buttons?: any;
  assistant: string[];
  icon?: IconProp;
}
