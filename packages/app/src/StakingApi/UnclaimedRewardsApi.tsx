// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { usePayouts } from 'contexts/Payouts'
import { useUnclaimedRewards } from 'plugin-staking-api'
import { useEffect } from 'react'
import type { Props } from './types'

export const UnclaimedRewardsApi = ({ activeAccount, network }: Props) => {
  const { activeEra } = useApi()
  const { setUnclaimedRewards } = usePayouts()

  const { data, loading, error } = useUnclaimedRewards({
    chain: network,
    who: activeAccount,
    fromEra: Math.max(activeEra.index.minus(1).toNumber(), 0),
  })

  // Update unclaimed rewards on total change
  useEffect(() => {
    if (!loading && !error && data?.unclaimedRewards) {
      setUnclaimedRewards(data?.unclaimedRewards)
    }
  }, [data?.unclaimedRewards.total])

  return null
}
