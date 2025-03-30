// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { TxSubmissionItem } from 'api/types'
import { isCustomEvent } from 'controllers/utils'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import type { TxMetaContextInterface } from './types'

export const [TxMetaContext, useTxMeta] =
  createSafeContext<TxMetaContextInterface>()

export const TxMetaProvider = ({ children }: { children: ReactNode }) => {
  // Store uids of transactions, along with their status
  const [uids, setUids] = useState<TxSubmissionItem[]>([])

  const handleNewUidStatus = (e: Event) => {
    if (isCustomEvent(e)) {
      const { uids: eventUids } = e.detail
      setUids(eventUids)
    }
  }

  // Get a tx submission
  const getTxSubmission = (uid?: number) =>
    uids.find((item) => item.uid === uid)

  // Get a tx submission by tag
  const getTxSubmissionByTag = (tag?: string) =>
    uids.find((item) => item.tag === tag)

  useEventListener(
    'new-tx-uid-status',
    handleNewUidStatus,
    useRef<Document>(document)
  )

  return (
    <TxMetaContext.Provider
      value={{
        uids,
        getTxSubmission,
        getTxSubmissionByTag,
      }}
    >
      {children}
    </TxMetaContext.Provider>
  )
}
