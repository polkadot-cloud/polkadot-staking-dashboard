// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FastUnstakeConfig } from 'api/subscribe/fastUnstakeConfig'
import type { FastUnstakeHead } from 'api/subscribe/fastUnstakeConfig/types'
import { FastUnstakeQueue } from 'api/subscribe/fastUnstakeQueue'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Apis } from 'controllers/Apis'
import { Subscriptions } from 'controllers/Subscriptions'
import { isCustomEvent } from 'controllers/utils'
import type { FastUnstakeResult } from 'plugin-staking-api/types'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import { defaultFastUnstakeContext } from './defaults'
import type {
  FastUnstakeContextInterface,
  FastUnstakeQueueDeposit,
} from './types'

export const FastUnstakeContext = createContext<FastUnstakeContextInterface>(
  defaultFastUnstakeContext
)

export const useFastUnstake = () => useContext(FastUnstakeContext)

export const FastUnstakeProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi()
  const { network } = useNetwork()
  const { activeAccount } = useActiveAccounts()

  // store fast unstake status
  const [fastUnstakeStatus, setFastUnstakeStatus] =
    useState<FastUnstakeResult | null>(null)

  // store fastUnstake queue deposit for user
  const [queueDeposit, setQueueDeposit] = useState<FastUnstakeQueueDeposit>()

  // store fastUnstake head
  const [head, setHead] = useState<FastUnstakeHead | undefined>()

  // store fastUnstake counter for queue
  const [counterForQueue, setCounterForQueue] = useState<number | undefined>()

  // Reset state on active account change
  useEffect(() => {
    // Reset fast unstake managment state
    setQueueDeposit(undefined)
    // Re-subscribe to fast unstake queue
    Subscriptions.remove(network, 'fastUnstakeQueue')

    if (activeAccount) {
      Subscriptions.set(
        network,
        'fastUnstakeQueue',
        new FastUnstakeQueue(network, activeAccount)
      )
    }
  }, [activeAccount])

  // Reset state on network change
  useEffect(() => {
    setHead(undefined)
    setCounterForQueue(undefined)
  }, [network])

  // Subscribe to fast unstake queue as soon as api is ready
  useEffect(() => {
    if (isReady) {
      subscribeToFastUnstakeMeta()
    }
  }, [isReady])

  // subscribe to fastUnstake queue
  const subscribeToFastUnstakeMeta = async () => {
    const api = Apis.getApi(network)
    if (!api) {
      return
    }
    Subscriptions.set(
      network,
      'fastUnstakeMeta',
      new FastUnstakeConfig(network)
    )
  }

  // Handle fast unstake meta events
  const handleNewFastUnstakeConfig = (e: Event) => {
    if (isCustomEvent(e)) {
      const { head: eventHead, counterForQueue: eventCounterForQueue } =
        e.detail
      setHead(eventHead)
      setCounterForQueue(eventCounterForQueue)
    }
  }

  // Handle fast unstake deposit events
  const handleNewFastUnstakeDeposit = (e: Event) => {
    if (isCustomEvent(e)) {
      const { address, deposit } = e.detail
      setQueueDeposit({ address, deposit: new BigNumber(deposit.toString()) })
    }
  }

  const documentRef = useRef<Document>(document)
  useEventListener(
    'new-fast-unstake-config',
    handleNewFastUnstakeConfig,
    documentRef
  )
  useEventListener(
    'new-fast-unstake-deposit',
    handleNewFastUnstakeDeposit,
    documentRef
  )

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
