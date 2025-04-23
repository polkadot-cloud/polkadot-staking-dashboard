// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionInjected } from '@w3ux/types'
import type { AccountProxiesEvent } from 'api/subscribe/accountProxies/types'
import type { FastUnstakeConfigResult } from 'api/subscribe/fastUnstakeConfig/types'
import type { PoolMemberBatchEvent } from 'api/subscribe/poolMembers/types'
import type { PapiReadyEvent, TxSubmissionItem } from 'api/types'
import type { ActiveBalance } from 'contexts/Balances/types'
import type { BondedAccount } from 'contexts/Bonded/types'
import type { FastUnstakeQueueResult } from 'contexts/FastUnstake/types'
import type { NotificationItem } from 'controllers/Notifications/types'
import type { OnlineStatusEvent } from 'controllers/OnlineStatus/types'
import type { SyncEvent } from 'controllers/Syncs/types'
import type { FC } from 'react'
import type { AnyJson, DetailActivePool } from 'types'

declare global {
  interface Window {
    walletExtension?: AnyJson
    injectedWeb3?: Record<string, ExtensionInjected>
    opera?: boolean
  }
  interface DocumentEventMap {
    notification: CustomEvent<NotificationItem>
    'api-ready': CustomEvent<PapiReadyEvent>
    'online-status': CustomEvent<OnlineStatusEvent>
    'new-active-pool': CustomEvent<DetailActivePool>
    'removed-active-pool': CustomEvent<{ address: string; poolId: string }>
    'new-pool-members-batch': CustomEvent<PoolMemberBatchEvent>
    'new-fast-unstake-config': CustomEvent<FastUnstakeConfigResult>
    'new-fast-unstake-deposit': CustomEvent<FastUnstakeQueueResult>
    'new-account-proxies': CustomEvent<AccountProxiesEvent>
    'new-bonded-account': CustomEvent<BondedAccount>
    'new-sync-status': CustomEvent<SyncEvent>
    'new-external-account': CustomEvent<{ address: string }>
    'new-account-balance': CustomEvent<ActiveBalance & { address: string }>
    'new-tx-uid-status': CustomEvent<{ uids: TxSubmissionItem[] }>
  }
}
export interface PageCategory {
  id: number
  key: string
}

export type PageCategoryItems = PageCategory[]

export interface PageItem {
  category: number
  key: string
  uri: string
  hash: string
  Entry: FC<PageProps>
  lottie: AnyJson
  bullet?: BulletType
}

export type PagesConfigItems = PageItem[]

export interface PageProps {
  page: PageProp
}

interface PageProp {
  key: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyApi = any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyMetaBatch = any

export type BulletType = 'success' | 'accent' | 'warning' | 'danger'
