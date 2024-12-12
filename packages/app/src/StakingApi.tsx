// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePayouts } from 'contexts/Payouts'
import { ApolloProvider, client, useUnclaimedRewards } from 'plugin-staking-api'
import { useEffect } from 'react'

export const StakingApiInner = () => {
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { setUnclaimedRewards } = usePayouts()
  const { activeAccount } = useActiveAccounts()

  // Fetch and store unclaimed rewards
  const { data, loading, error } = useUnclaimedRewards({
    chain: network,
    who: activeAccount || '',
    fromEra: Math.max(activeEra.index.minus(1).toNumber(), 0),
  })

  useEffect(() => {
    if (!loading && !error && data?.unclaimedRewards) {
      setUnclaimedRewards(data?.unclaimedRewards)
    }
  }, [data?.unclaimedRewards.total])

  return null
}

export const StakingApi = () => (
  <ApolloProvider client={client}>
    <StakingApiInner />
  </ApolloProvider>
)
