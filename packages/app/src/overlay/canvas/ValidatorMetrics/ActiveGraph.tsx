// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId } from 'common-types'
import { EraPointsLine } from 'library/Graphs/EraPointsLine'
import { useValidatorEraPoints } from 'plugin-staking-api'
import type { PointsByEra } from 'types'

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
  const { data, loading, error } = useValidatorEraPoints({
    chain: network,
    validator,
    fromEra,
  })

  const list =
    loading || error || data?.validatorEraPoints === undefined
      ? []
      : data.validatorEraPoints

  const sorted: PointsByEra = Object.fromEntries(
    [...list]
      .sort((a, b) => a.era - b.era)
      .map((item) => [item.era, item.points])
  )

  return (
    <EraPointsLine
      syncing={false}
      pointsByEra={sorted}
      width={width}
      height={height}
    />
  )
}
