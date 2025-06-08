// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtensionInjected } from '@w3ux/types'
import type { NotificationItem } from 'controllers/Notifications/types'
import type { TxSubmissionItem } from 'controllers/TxSubmission/types'

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
    'new-tx-uid-status': CustomEvent<{ uids: TxSubmissionItem[] }>
  }
}
