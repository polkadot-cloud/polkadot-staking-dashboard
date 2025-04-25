// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionInjected } from '@w3ux/types'
import type { NotificationItem } from 'controllers/Notifications/types'
import type { OnlineStatusEvent } from 'controllers/OnlineStatus/types'
import type { SyncEvent } from 'controllers/Syncs/types'
import type { TxSubmissionItem } from 'controllers/TxSubmission/types'
import type { FC } from 'react'

declare global {
  interface Window {
    walletExtension?: {
      isNovaWallet?: boolean
    }
    injectedWeb3?: Record<string, ExtensionInjected>
    opera?: boolean
  }
  interface DocumentEventMap {
    notification: CustomEvent<NotificationItem>
    'api-ready': CustomEvent<{ chainType: string }>
    'online-status': CustomEvent<OnlineStatusEvent>
    'new-sync-status': CustomEvent<SyncEvent>
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
  lottie: unknown
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

export type BulletType = 'success' | 'accent' | 'warning' | 'danger'
