// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { FastUnstakeQueue } from 'api/subscribe/fastUnstakeQueue'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { Subscriptions } from 'controllers/Subscriptions'
import { isCustomEvent } from 'controllers/utils'
import { fastUnstakeConfig$ } from 'global-bus'
import type { FastUnstakeResult } from 'plugin-staking-api/types'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { FastUnstakeHead } from 'types'
import { useEventListener } from 'usehooks-ts'
import type {
  FastUnstakeContextInterface,
  FastUnstakeQueueDeposit,
} from './types'

export const [FastUnstakeContext, useFastUnstake] =
  createSafeContext<FastUnstakeContextInterface>()

export const FastUnstakeProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()

  // Store fast unstake status
  const [fastUnstakeStatus, setFastUnstakeStatus] =
    useState<FastUnstakeResult | null>(null)

  // Store fastUnstake queue deposit for user
  const [queueDeposit, setQueueDeposit] = useState<FastUnstakeQueueDeposit>()

  // Store fastUnstake head
  const [head, setHead] = useState<FastUnstakeHead | undefined>()

  // Store fastUnstake counter for queue
  const [counterForQueue, setCounterForQueue] = useState<number | undefined>()

  // Reset state on active account change
  useEffect(() => {
    // Reset fast unstake managment state
    setQueueDeposit(undefined)
    // Re-subscribe to fast unstake queue
    Subscriptions.remove(network, 'fastUnstakeQueue')

    if (activeAddress) {
      Subscriptions.set(
        network,
        'fastUnstakeQueue',
        new FastUnstakeQueue(network, activeAddress)
      )
    }
  }, [activeAddress])

  // Reset state on network change
  useEffect(() => {
    setHead(undefined)
    setCounterForQueue(undefined)
  }, [network])

  const handleNewFastUnstakeDeposit = (e: Event) => {
    if (isCustomEvent(e)) {
      const { address, deposit } = e.detail
      setQueueDeposit({ address, deposit: new BigNumber(deposit) })
    }
  }

  const documentRef = useRef<Document>(document)
  useEventListener(
    'new-fast-unstake-deposit',
    handleNewFastUnstakeDeposit,
    documentRef
  )

  useEffect(() => {
    const subFastUnstakeConfig = fastUnstakeConfig$.subscribe((result) => {
      setHead(result.head)
      setCounterForQueue(result.counterForQueue)
    })
    return () => {
      subFastUnstakeConfig.unsubscribe()
    }
  }, [])

  return (
    <FastUnstakeContext.Provider
      value={{
        exposed:
          !!fastUnstakeStatus?.lastExposed &&
          fastUnstakeStatus?.status === 'EXPOSED',
        queueDeposit,
        head,
        counterForQueue,
        setFastUnstakeStatus,
        fastUnstakeStatus,
      }}
    >
      {children}
    </FastUnstakeContext.Provider>
  )
}
