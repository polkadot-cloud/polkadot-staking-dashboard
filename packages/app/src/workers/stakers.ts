// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import type { Staker } from 'contexts/EraStakers/types'
import type { ActiveAccountStaker } from 'contexts/Staking/types'
import type { ProcessExposuresArgs } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ctx: Worker = self as any

// handle incoming message and route to correct handler
ctx.addEventListener('message', (event: MessageEvent) => {
  const { data } = event
  const { task } = data
  if (task === 'processExposures') {
    const message = processExposures(data as ProcessExposuresArgs)
    postMessage({ ...message })
  }
})

// Process exposures with active account stake
const processExposures = (data: ProcessExposuresArgs) => {
  const { task, networkName, era, units, exposures, activeAccount } = data

  const stakers: Staker[] = []
  const activeAccountOwnStake: ActiveAccountStaker[] = []

  exposures.forEach(({ keys, val }) => {
    const address = keys[1]
    let others =
      val.others.map((o) => ({
        ...o,
        value: o.value,
      })) ?? []

    if (others.length) {
      // Sort `others` by value bonded, largest first.
      others = others.sort((a, b) => {
        const r = new BigNumber(b.value).minus(a.value)
        return r.isZero() ? 0 : r.isLessThan(0) ? -1 : 1
      })
      stakers.push({
        address,
        others,
        own: val.own,
        total: val.total,
      })
      const own = others.find(({ who }) => who === activeAccount)
      if (own !== undefined) {
        activeAccountOwnStake.push({
          address,
          value: planckToUnit(own.value, units),
        })
      }
    }
  })

  return {
    networkName,
    era,
    stakers,
    activeAccountOwnStake,
    task,
    who: activeAccount,
  }
}
