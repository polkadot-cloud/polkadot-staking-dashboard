// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionInjected } from '@w3ux/react-connect-kit/types';
import type { AnyJson } from '@w3ux/types';
import type { AccountProxiesEvent } from 'api/subscribe/accountProxies/types';
import type { BlockNumberEventDetail } from 'api/subscribe/blockNumber/types';
import type { FastUnstakeConfigResult } from 'api/subscribe/fastUnstakeConfig/types';
import type { PoolMemberBatchEvent } from 'api/subscribe/poolMembers/types';
import type { APIEventDetail, PapiReadyEvent } from 'api/types';
import type BigNumber from 'bignumber.js';
import type {
  APIActiveEra,
  APINetworkMetrics,
  APIPoolsConfig,
  APIStakingMetrics,
} from 'contexts/Api/types';
import type { ActiveBalance } from 'contexts/Balances/types';
import type { BondedAccount } from 'contexts/Bonded/types';
import type { FastUnstakeQueueResult } from 'contexts/FastUnstake/types';
import type { Theme } from 'contexts/Themes/types';
import type { DetailActivePool } from 'controllers/ActivePools/types';
import type { NotificationItem } from 'controllers/Notifications/types';
import type { OnlineStatusEvent } from 'controllers/OnlineStatus/types';
import type { PayoutType } from 'controllers/Subscan/types';
import type { SyncEvent } from 'controllers/Syncs/types';
import type { FC, FunctionComponent, SVGProps } from 'react';

declare global {
  interface Window {
    walletExtension?: AnyJson;
    injectedWeb3?: Record<string, ExtensionInjected>;
    opera?: boolean;
  }
  interface DocumentEventMap {
    notification: CustomEvent<NotificationItem>;
    'api-status': CustomEvent<APIEventDetail>;
    'api-ready': CustomEvent<PapiReadyEvent>;
    'online-status': CustomEvent<OnlineStatusEvent>;
    'new-block-number': CustomEvent<BlockNumberEventDetail>;
    'new-network-metrics': CustomEvent<{
      networkMetrics: APINetworkMetrics;
    }>;
    'new-active-era': CustomEvent<{ activeEra: APIActiveEra }>;
    'new-pools-config': CustomEvent<{ poolsConfig: APIPoolsConfig }>;
    'new-staking-metrics': CustomEvent<{
      stakingMetrics: APIStakingMetrics;
    }>;
    'new-active-pool': CustomEvent<DetailActivePool>;
    'new-pool-members-batch': CustomEvent<PoolMemberBatchEvent>;
    'new-fast-unstake-config': CustomEvent<FastUnstakeConfigResult>;
    'new-fast-unstake-deposit': CustomEvent<FastUnstakeQueueResult>;
    'new-account-proxies': CustomEvent<AccountProxiesEvent>;
    'new-bonded-account': CustomEvent<BondedAccount>;
    'new-sync-status': CustomEvent<SyncEvent>;
    'new-external-account': CustomEvent<{ address: string }>;
    'new-account-balance': CustomEvent<ActiveBalance & { address: string }>;
    'subscan-data-updated': CustomEvent<{ keys: PayoutType[] }>;
  }
}

export type ChainId = NetworkId | SystemChainId;

export type NetworkId = 'polkadot' | 'kusama' | 'westend';

export type SystemChainId =
  | 'people-polkadot'
  | 'people-kusama'
  | 'people-westend';

export type Networks = Record<string, Network>;

type NetworkColor =
  | 'primary'
  | 'secondary'
  | 'stroke'
  | 'transparent'
  | 'pending';
export interface Network {
  name: NetworkId;
  endpoints: {
    lightClientKey: string;
    lightClient: () => Promise<AnyApi>;
    defaultRpcEndpoint: string;
    rpcEndpoints: Record<string, string>;
  };

  colors: Record<NetworkColor, { [key in Theme]: string }>;
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
    inline: {
      svg: FunctionComponent<
        SVGProps<SVGSVGElement> & { title?: string | undefined }
      >;
      size: string;
    };
  };
  api: {
    unit: string;
  };
  defaultFeeReserve: number;
  maxExposurePageSize: BigNumber;
}

export interface SystemChain {
  name: string;
  ss58: number;
  units: number;
  unit: string;
  endpoints: {
    lightClientKey: string;
    lightClient: () => Promise<AnyApi>;
    rpcEndpoints: Record<string, string>;
  };
  relayChain: NetworkId;
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
  Entry: FC<PageProps>;
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

// track whether bonding should be for nominator or nomination pool.
export type BondFor = 'pool' | 'nominator';

// generic function with no args or return type.
export type Fn = () => void;

// any types to compress compiler warnings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyApi = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyMetaBatch = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySubscan = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPolkawatch = any;
