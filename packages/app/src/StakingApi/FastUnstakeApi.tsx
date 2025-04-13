// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useFastUnstake } from 'contexts/FastUnstake'
import { useCanFastUnstake } from 'plugin-staking-api'
import { useEffect } from 'react'
import type { Props } from './types'

export const FastUnstakeApi = ({ who, network }: Props) => {
  const { setFastUnstakeStatus } = useFastUnstake()
  const { data, loading, error } = useCanFastUnstake({
    network,
    who,
  })

  // Update fast unstake status on active account change. Must be bonding
  useEffect(() => {
    if (!loading && !error && data?.canFastUnstake) {
      setFastUnstakeStatus(data.canFastUnstake)
    }
  }, [JSON.stringify(data?.canFastUnstake)])

  return null
}
