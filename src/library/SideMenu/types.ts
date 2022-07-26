// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { FunctionComponent, SVGProps } from 'react';

export interface MinimisedProps {
  minimised: number;
}

export interface HeadingProps {
  title: string;
  minimised: number;
}

export interface PrimaryProps {
  name: string;
  active: boolean;
  to: string;
  icon: React.ReactNode;
  action: boolean;
  minimised: number;
}

export interface SecondaryProps {
  name: string;
  active?: boolean;
  to?: string;
  icon: IconProps;
  action?: React.ReactNode;
  minimised?: any;
}

export interface IconProps {
  Svg: FunctionComponent<
  SVGProps<SVGSVGElement>>;
  size?: string;
}
