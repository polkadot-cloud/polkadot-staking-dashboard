// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import type { NetworkId } from 'common-types'
import { PayoutLine } from 'library/Graphs/PayoutLine'
import { useRewards } from 'plugin-staking-api'

interface Props {
  network: NetworkId
  stash: string
  fromEra: number
  width: string | number
  height: string | number
  units: number
}
export const ActiveGraph = ({
  network,
  stash,
  fromEra,
  width,
  height,
  units,
}: Props) => {
  const { data, loading, error } = useRewards({
    chain: network,
    who: stash,
    fromEra,
  })

  const list =
    loading || error || data?.allRewards === undefined
      ? []
      : data.allRewards.map((reward) => ({
          era: reward.era,
          reward: planckToUnit(reward.reward, units),
          start: reward.timestamp,
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
