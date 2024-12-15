// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePayouts } from 'contexts/Payouts'
import { ApolloProvider, client, useUnclaimedRewards } from 'plugin-staking-api'
import { useEffect } from 'react'

interface Props {
  activeAccount: string
}

const Inner = ({ activeAccount }: Props) => {
  const { activeEra } = useApi()
  const { network } = useNetwork()
  const { setUnclaimedRewards } = usePayouts()

  const { data, loading, error } = useUnclaimedRewards({
    chain: network,
    who: activeAccount,
    fromEra: Math.max(activeEra.index.minus(1).toNumber(), 0),
  })

  useEffect(() => {
    if (!loading && !error && data?.unclaimedRewards) {
      setUnclaimedRewards(data?.unclaimedRewards)
    }
  }, [data?.unclaimedRewards.total])

  return null
}

export const StakingApi = (props: Props) => (
  <ApolloProvider client={client}>
    <Inner {...props} />
  </ApolloProvider>
)
