// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { FunctionComponent, SVGProps } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PageProps } from 'pages/types';

export type Fn = () => void;

export enum NetworkName {
  Polkadot = 'polkadot',
  Westend = 'westend',
}

export enum Toggle {
  Open = 'open',
  Closed = 'closed',
}

export interface NodeEndpoint {
  name: string;
  colors: {
    primary: {
      light: string;
      dark: string;
    };
    secondary: {
      light: string;
      dark: string;
    };
  };
  endpoint: string;
  subscanEndpoint: string;
  unit: string;
  units: number;
  ss58: number;
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  logo: {
    svg: FunctionComponent<
      SVGProps<SVGSVGElement> & { title?: string | undefined }
    >;
    width: string;
  };
  api: {
    unit: string;
    priceTicker: string;
  };
  features: {
    pools: boolean;
  };
}

export interface NodeEndpoints {
  [key: string]: NodeEndpoint;
}

export type PageCategories = Array<{
  _id: number;
  title: string;
}>;

export type PagesConfig = Array<{
  category: number;
  title: string;
  uri: string;
  hash: string;
  Entry: React.FC<PageProps>;
  icon: IconDefinition;
}>;

export type MaybeAccount = string | null;

// any types to compress compiler warnings
// eslint-disable-next-line
export type AnyApi = any;
// eslint-disable-next-line
export type AnyMetaBatch = any;
