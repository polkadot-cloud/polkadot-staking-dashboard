// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface MinimisedProps {
  minimised: number;
}

export interface HeadingProps {
  title: string;
  minimised: number;
}

export interface ItemProps {
  name: string;
  active: boolean;
  to: string;
  icon: React.ReactNode;
  action: boolean;
  minimised: number;
}
