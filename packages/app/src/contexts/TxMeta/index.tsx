// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TxSubmissionItem } from 'api/types'
import { isCustomEvent } from 'controllers/utils'
import type { ReactNode } from 'react'
import { createContext, useContext, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import * as defaults from './defaults'
import type { TxMetaContextInterface } from './types'

export const TxMetaContext = createContext<TxMetaContextInterface>(
  defaults.defaultTxMeta
)

export const useTxMeta = () => useContext(TxMetaContext)

export const TxMetaProvider = ({ children }: { children: ReactNode }) => {
  // Store uids of transactions, along with their processing status.
  const [uids, setUids] = useState<TxSubmissionItem[]>([])

  const handleNewUidStatus = (e: Event) => {
    if (isCustomEvent(e)) {
      const { uids: eventUids } = e.detail
      setUids(eventUids)
    }
  }

  // Get a tx submission.
  const getTxSubmission = (uid?: number) =>
    uids.find((item) => item.uid === uid)

  // Get a tx submission by tag.
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
