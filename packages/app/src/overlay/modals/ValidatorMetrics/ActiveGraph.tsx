// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId } from 'common-types'
import { EraPoints } from 'library/Graphs/EraPoints'
import { useValidatorEraPoints } from 'plugin-staking-api'

interface Props {
  network: NetworkId
  validator: string
  fromEra: number
}
export const ActiveGraph = ({ network, validator, fromEra }: Props) => {
  const { data, loading, error } = useValidatorEraPoints({
    chain: network,
    validator,
    fromEra,
  })

  const list =
    loading || error || data?.validatorEraPoints === undefined
      ? []
      : data.validatorEraPoints

  const sorted = [...list].sort((a, b) => a.era - b.era)

  return <EraPoints items={sorted} height={250} />
}
