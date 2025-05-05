// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { CardLabel, TokenFiat } from 'ui-core/base'
import { Value } from '../Value'

export const WithFiat = ({
  Token,
  value,
  currency,
  label,
}: {
  Token: ReactNode
  value: number
  currency: string
  label?: string
}) => {
  const { network } = useNetwork()
  const { units } = getNetworkData(network)

  const valueFormatted =
    String(value) === '0' ? 0 : new BigNumber(value).toFormat(units)

  // Show token balance with fiat value
  return (
    <TokenFiat Token={Token}>
      <h1>
        <Odometer
          value={minDecimalPlaces(valueFormatted, 2)}
          zeroDecimals={2}
        />
        {label && <CardLabel>&nbsp;{label}</CardLabel>}
      </h1>
      <h3>
        <Value tokenBalance={valueFormatted} currency={currency} />
      </h3>
    </TokenFiat>
  )
}
