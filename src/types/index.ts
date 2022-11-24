// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { WellKnownChain } from '@polkadot/rpc-provider/substrate-connect';
import { PageProps } from 'pages/types';
import React, { FunctionComponent, SVGProps } from 'react';

export type Fn = () => void;

export enum NetworkName {
  Polkadot = 'polkadot',
  Kusama = 'kusama',
  Westend = 'westend',
  AlephZeroTestnet = 'alephzerotestnet',
}

export enum Toggle {
  Open = 'open',
  Closed = 'closed',
}

export interface Networks {
  [key: string]: Network;
}

export interface Network {
  name: string;
  endpoints: {
    rpc: string;
    lightClient: WellKnownChain | null;
  };
  colors: {
    primary: {
      light: string;
      dark: string;
    };
    secondary: {
      light: string;
      dark: string;
    };
    transparent: {
      light: string;
      dark: string;
    };
  };
  subscanEndpoint: string;
  unit: string;
  units: number;
  ss58: number;
  brand: {
    icon: FunctionComponent<
      SVGProps<SVGSVGElement> & { title?: string | undefined }
    >;
    logo: {
      svg: FunctionComponent<
        SVGProps<SVGSVGElement> & { title?: string | undefined }
      >;
      width: string;
    };
    inline: {
      svg: FunctionComponent<
        SVGProps<SVGSVGElement> & { title?: string | undefined }
      >;
      size: string;
    };
  };
  api: {
    unit: string;
    priceTicker: string;
  };
  params: { [key: string]: number };
}

export interface PageCategory {
  id: number;
  key: string;
}

export type PageCategories = Array<PageCategory>;

export interface PageItem {
  category: number;
  key: string;
  uri: string;
  hash: string;
  Entry: React.FC<PageProps>;
  icon?: IconDefinition;
  animate?: AnyJson;
  action?: {
    type: string;
    status: string;
    text?: string | undefined;
  };
}

export type PagesConfig = Array<PageItem>;

export type MaybeAccount = string | null;

export type MaybeString = string | null;

// any types to compress compiler warnings
// eslint-disable-next-line
export type AnyApi = any;
// eslint-disable-next-line
export type AnyJson = any;
// eslint-disable-next-line
export type AnyMetaBatch = any;
// eslint-disable-next-line
export type AnySubscan = any;

// track the status of a syncing / fetching process.
export enum Sync {
  Unsynced,
  Syncing,
  Synced,
}
