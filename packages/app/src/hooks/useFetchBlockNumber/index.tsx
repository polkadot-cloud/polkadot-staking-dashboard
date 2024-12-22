// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BlockNumber } from 'api/query/blockNumber'
import type { NetworkId } from 'common-types'
import { useApi } from 'contexts/Api'
import { useEffect, useState } from 'react'

export const useFetchBlockNumber = (network: NetworkId) => {
  const { isReady } = useApi()
  const [blockNumber, setBlockNumber] = useState<number>(0)

  const fetchPoolRewardsFrom = async () => {
    const block = await new BlockNumber(network).fetch()
    setBlockNumber(block)
  }

  useEffect(() => {
    fetchPoolRewardsFrom()
  }, [isReady, network])

  return blockNumber
}
