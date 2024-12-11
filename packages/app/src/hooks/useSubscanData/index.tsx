// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { usePlugins } from 'contexts/Plugins'
import { Subscan } from 'controllers/Subscan'
import type {
  PayoutType,
  SubscanPayout,
  SubscanPoolClaim,
} from 'controllers/Subscan/types'
import { isCustomEvent } from 'controllers/utils'
import { useEffect, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import { useErasToTimeLeft } from '../useErasToTimeLeft'

export const useSubscanData = () => {
  const { activeEra } = useApi()
  const { pluginEnabled } = usePlugins()
  const { erasToSeconds } = useErasToTimeLeft()
  const { activeAccount } = useActiveAccounts()

  // Store payouts data for the active account.
  const [payouts, setPayouts] = useState<SubscanPayout[]>([])

  // Store unclaimed payouts data for the active account.
  const [unclaimedPayouts, setUnclaimedPayouts] = useState<SubscanPayout[]>([])

  // Store pool claims data for the active account.
  const [poolClaims, setPoolClaims] = useState<SubscanPoolClaim[]>([])

  // Listen for updated data callback. When there are new data, fetch the updated values directly
  // from `Subscan` and commit to component state.
  const subscanPayoutsUpdatedCallback = (e: Event) => {
    // NOTE: Subscan has to be enabled to continue.
    if (isCustomEvent(e) && pluginEnabled('subscan') && activeAccount) {
      const { keys: receivedKeys }: { keys: PayoutType[] } = e.detail

      if (receivedKeys.includes('payouts')) {
        setPayouts(
          (Subscan.payoutData[activeAccount]?.['payouts'] ||
            []) as SubscanPayout[]
        )
      }

      if (receivedKeys.includes('unclaimedPayouts')) {
        setUnclaimedPayouts(
          (Subscan.payoutData[activeAccount]?.['unclaimedPayouts'] ||
            []) as SubscanPayout[]
        )
      }

      if (receivedKeys.includes('poolClaims')) {
        setPoolClaims(
          (Subscan.payoutData[activeAccount]?.['poolClaims'] ||
            []) as SubscanPoolClaim[]
        )
      }
    }
  }

  // Listen for new subscan data updates.
  const documentRef = useRef<Document>(document)
  useEventListener(
    'subscan-data-updated',
    subscanPayoutsUpdatedCallback,
    documentRef
  )

  // Inject block_timestamp for unclaimed payouts. We take the timestamp of the start of the
  // following payout era - this is the time payouts become available to claim by validators.
  const injectBlockTimestamp = (entries: SubscanPayout[]) => {
    if (!entries) {
      return entries
    }
    entries.forEach((p) => {
      p.block_timestamp = activeEra.start
        .multipliedBy(0.001)
        .minus(erasToSeconds(activeEra.index.minus(p.era).minus(1)))
        .toNumber()
    })
    return entries
  }

  // Populate state on initial render if data is already available.
  useEffect(() => {
    if (activeAccount) {
      setPayouts(
        (Subscan.payoutData[activeAccount]?.['payouts'] ||
          []) as SubscanPayout[]
      )
      setUnclaimedPayouts(
        (Subscan.payoutData[activeAccount]?.['unclaimedPayouts'] ||
          []) as SubscanPayout[]
      )
      setPoolClaims(
        (Subscan.payoutData[activeAccount]?.['poolClaims'] ||
          []) as SubscanPoolClaim[]
      )
    }
  }, [activeAccount])

  return {
    payouts,
    unclaimedPayouts,
    poolClaims,
    injectBlockTimestamp,
  }
}
