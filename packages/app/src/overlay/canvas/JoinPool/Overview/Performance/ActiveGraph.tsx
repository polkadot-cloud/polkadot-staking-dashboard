// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId } from 'common-types'
import { EraPointsLine } from 'library/Graphs/EraPointsLine'
import { usePoolEraPoints } from 'plugin-staking-api'

interface Props {
  network: NetworkId
  poolId: number
  fromEra: number
  width: string | number
  height: string | number
}
export const ActiveGraph = ({
  network,
  poolId,
  fromEra,
  width,
  height,
}: Props) => {
  const { data, loading, error } = usePoolEraPoints({
    chain: network,
    poolId,
    fromEra,
  })

  const list =
    loading || error || data?.poolEraPoints === undefined
      ? []
      : data.poolEraPoints

  const sorted = [...list].sort((a, b) => a.era - b.era)

  return (
    <EraPointsLine
      syncing={false}
      entries={sorted}
      width={width}
      height={height}
    />
  )
}
