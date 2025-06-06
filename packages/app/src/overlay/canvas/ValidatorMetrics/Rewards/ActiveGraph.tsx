// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { PayoutLine } from 'library/Graphs/PayoutLine'
import { useValidatorRewards } from 'plugin-staking-api'
import type { NetworkId } from 'types'

interface Props {
  network: NetworkId
  validator: string
  fromEra: number
  width: string | number
  height: string | number
}
export const ActiveGraph = ({
  network,
  validator,
  fromEra,
  width,
  height,
}: Props) => {
  const { data, loading, error } = useValidatorRewards({
    network,
    validator,
    fromEra,
  })
  const { units } = getStakingChainData(network)

  const list =
    loading || error || data?.validatorRewards === undefined
      ? []
      : data.validatorRewards.map((reward) => ({
          era: reward.era,
          reward: planckToUnit(reward.reward, units),
          start: reward.start,
        }))

  const sorted = [...list].sort((a, b) => a.era - b.era)

  return (
    <PayoutLine
      syncing={loading}
      entries={sorted}
      width={width}
      height={height}
    />
  )
}
