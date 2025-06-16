// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import type {
  ActiveAccountStaker,
  ExposureOther,
  Staker,
} from 'contexts/Staking/types'
import type { ProcessExposuresArgs } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ctx: Worker = self as any

// handle incoming message and route to correct handler.
ctx.addEventListener('message', (event: MessageEvent) => {
  const { data } = event
  const { task } = data
  if (task === 'processExposures') {
    const message = processExposures(data as ProcessExposuresArgs)
    postMessage({ ...message })
  }
})

// process exposures.
//
// abstracts active nominators erasStakers.
const processExposures = (data: ProcessExposuresArgs) => {
  const { task, networkName, era, units, exposures, activeAccount } = data

  const stakers: Staker[] = []
  let activeValidators = 0
  const activeAccountOwnStake: ActiveAccountStaker[] = []
  const nominators: ExposureOther[] = []

  exposures.forEach(({ keys, val }) => {
    activeValidators++

    const address = keys[1]
    let others =
      val?.others.map((o) => ({
        ...o,
        value: o.value,
      })) ?? []

    // Accumulate active nominators and min active stake threshold.
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

      // Accumulate active stake for all nominators.
      for (const o of others) {
        const value = new BigNumber(o.value)

        // Check nominator already exists.
        const index = nominators.findIndex(({ who }) => who === o.who)

        // Add value to nominator, otherwise add new entry.
        if (index === -1) {
          nominators.push({
            who: o.who,
            value: value.toString(),
          })
        } else {
          nominators[index].value = new BigNumber(nominators[index].value)
            .plus(value)
            .toString()
        }
      }

      // get own stake if present
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
    totalActiveNominators: nominators.length,
    activeAccountOwnStake,
    activeValidators,
    task,
    who: activeAccount,
  }
}
