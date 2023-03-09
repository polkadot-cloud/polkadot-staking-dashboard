// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { FunctionComponent, SVGProps } from 'react';
import type { AnyJson } from 'types';

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
  icon?: React.ReactNode;
  animate?: AnyJson;
  action: undefined | { type: string; status: string; text?: string };
  minimised: number;
}

export interface SecondaryProps {
  name: string;
  classes?: Array<string>;
  onClick: () => void;
  active?: boolean;
  to?: string;
  icon?: IconProps;
  action?: React.ReactNode;
  minimised: number;
  animate?: AnyJson;
}

export interface IconProps {
  Svg: FunctionComponent<SVGProps<SVGSVGElement>>;
  size?: string;
}
