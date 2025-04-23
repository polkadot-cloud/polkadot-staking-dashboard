// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useNetwork } from 'contexts/Network'
import { fastUnstakeConfig$, fastUnstakeQueue$ } from 'global-bus'
import type { FastUnstakeResult } from 'plugin-staking-api/types'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { FastUnstakeHead, FastUnstakeQueue } from 'types'
import type { FastUnstakeContextInterface } from './types'

export const [FastUnstakeContext, useFastUnstake] =
  createSafeContext<FastUnstakeContextInterface>()

export const FastUnstakeProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()

  // Store fast unstake status
  const [fastUnstakeStatus, setFastUnstakeStatus] =
    useState<FastUnstakeResult | null>(null)

  // Store fastUnstake queue deposit for user
  const [queueDeposit, setQueueDeposit] = useState<FastUnstakeQueue>()

  // Store fastUnstake head
  const [head, setHead] = useState<FastUnstakeHead | undefined>()

  // Store fastUnstake counter for queue
  const [counterForQueue, setCounterForQueue] = useState<number | undefined>()

  // Reset state on network change
  useEffect(() => {
    setHead(undefined)
    setCounterForQueue(undefined)
  }, [network])

  useEffect(() => {
    const subFastUnstakeConfig = fastUnstakeConfig$.subscribe((result) => {
      setHead(result.head)
      setCounterForQueue(result.counterForQueue)
    })
    const subFastUnstakeQueue = fastUnstakeQueue$.subscribe((result) => {
      setQueueDeposit(result)
    })

    return () => {
      subFastUnstakeConfig.unsubscribe()
      subFastUnstakeQueue.unsubscribe()
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
