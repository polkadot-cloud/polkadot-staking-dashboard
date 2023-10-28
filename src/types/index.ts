// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type React from 'react';
import type { FunctionComponent, SVGProps } from 'react';
import type { Theme } from 'contexts/Themes/types';
import type { ExtensionInjected } from '@polkadot-cloud/react/types';

declare global {
  interface Window {
    injectedWeb3?: Record<string, ExtensionInjected>;
  }
}

export type NetworkName = 'polkadot' | 'kusama' | 'westend';

export type Networks = Record<string, Network>;

type NetworkColor =
  | 'primary'
  | 'secondary'
  | 'stroke'
  | 'transparent'
  | 'pending';
export interface Network {
  name: NetworkName;
  endpoints: {
    lightClient: AnyApi;
    defaultRpcEndpoint: string;
    rpcEndpoints: Record<string, string>;
  };
  namespace: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colors: Record<NetworkColor, { [key in Theme]: string }>;
  subscanEndpoint: string;
  unit: string;
  units: number;
  ss58: number;
  brand: {
    icon: FunctionComponent<
      SVGProps<SVGSVGElement> & { title?: string | undefined }
    >;
    token: FunctionComponent<
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
  params: Record<string, number>;
  defaultFeeReserve: number;
}

export interface PageCategory {
  id: number;
  key: string;
}

export type PageCategoryItems = PageCategory[];

export interface PageItem {
  category: number;
  key: string;
  uri: string;
  hash: string;
  Entry: React.FC<PageProps>;
  lottie: AnyJson;
  action?: {
    type: string;
    status: string;
    text?: string | undefined;
  };
}

export type PagesConfigItems = PageItem[];

export interface PageProps {
  page: PageProp;
}

interface PageProp {
  key: string;
}

export type MaybeAddress = string | null;

export type MaybeString = string | null;

// list of available plugins.
export type Plugin = 'subscan' | 'binance_spot' | 'tips' | 'polkawatch';

// track the status of a syncing / fetching process.
export type Sync = 'unsynced' | 'syncing' | 'synced';

// track whether bonding should be for nominator or nomination pool.
export type BondFor = 'pool' | 'nominator';

// which medium components are being displayed on.
export type DisplayFor = 'default' | 'modal' | 'canvas';

// generic function with no args or return type.
export type Fn = () => void;

// any types to compress compiler warnings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyApi = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyJson = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyMetaBatch = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySubscan = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPolkawatch = any;
