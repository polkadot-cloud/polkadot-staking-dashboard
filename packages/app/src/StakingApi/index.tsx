// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useFastUnstake } from 'contexts/FastUnstake'
import { useStaking } from 'contexts/Staking'
import { useEffect } from 'react'
import { FastUnstakeApi } from './FastUnstakeApi'
import type { Props } from './types'
import { UnclaimedRewardsApi } from './UnclaimedRewardsApi'

export const StakingApi = (props: Props) => {
  const { isBonding } = useStaking()
  const { setFastUnstakeStatus } = useFastUnstake()

  useEffect(() => {
    if (!isBonding()) {
      setFastUnstakeStatus(null)
    }
  }, [isBonding()])

  return (
    <>
      <UnclaimedRewardsApi {...props} />
      {isBonding() && <FastUnstakeApi {...props} />}
    </>
  )
}
