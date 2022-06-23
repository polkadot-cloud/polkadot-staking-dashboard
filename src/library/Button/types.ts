// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface ButtonProps {
  onClick?: () => void;
  primary?: boolean;
  secondary?: string;
  inline?: boolean;
  small?: boolean;
  disabled?: boolean;
  icon?: IconProp;
  transform?: string;
  title: string;
}

export interface ButtonWrapperProps {
  margin: string;
  type: string;
  padding: string;
  fontSize: string;
}
