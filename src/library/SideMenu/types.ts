// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { FunctionComponent, SVGProps } from 'react';
import type { AnyJson } from 'types';
import {AnyStyledComponent} from "styled-components";

export interface MinimisedProps {
  minimised: boolean;
}

export interface HeadingProps {
  title: string;
  minimised: boolean;
}

export interface PrimaryProps {
  name: string;
  active: boolean;
  to: string;
  icon: any;
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
  action?: React.ReactNode;
  minimised: boolean;
}

export interface IconProps {
  Svg: FunctionComponent<SVGProps<SVGSVGElement>>;
  size?: string;
}
