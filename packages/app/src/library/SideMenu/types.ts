// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FunctionComponent, ReactNode, SVGProps } from 'react';
import type { AnyJson } from '@w3ux/types';

export interface MinimisedProps {
  $minimised?: boolean;
}

export interface HeadingProps {
  title: string;
  minimised: boolean;
}

export interface PrimaryProps {
  name: string;
  active: boolean;
  to: string;
  lottie: AnyJson;
  action: undefined | { type: string; status: string; text?: string };
  minimised: boolean;
}

export interface SecondaryProps {
  name: string;
  classes?: string[];
  onClick: () => void;
  active?: boolean;
  to?: string;
  icon: IconProps;
  action?: ReactNode;
  minimised: boolean;
}

export interface IconProps {
  Svg: FunctionComponent<SVGProps<SVGSVGElement>>;
  size?: string;
}
