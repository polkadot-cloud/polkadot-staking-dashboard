// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { EraPointsLine } from 'library/Graphs/EraPointsLine'
import { useValidatorEraPoints } from 'plugin-staking-api'
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
  const { data, loading, error } = useValidatorEraPoints({
    network,
    validator,
    fromEra,
  })

  const list =
    loading || error || data?.validatorEraPoints === undefined
      ? []
      : data.validatorEraPoints

  const sorted = [...list].sort((a, b) => a.era - b.era)

  return (
    <EraPointsLine
      syncing={loading}
      entries={sorted}
      width={width}
      height={height}
    />
  )
}
