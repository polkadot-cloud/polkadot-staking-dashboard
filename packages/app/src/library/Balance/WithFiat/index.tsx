// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { TokenFiat } from 'ui-core/base'
import { Value } from '../Value'

export const WithFiat = ({
  Token,
  value,
  currency,
}: {
  Token: ReactNode
  value: number
  currency: string
}) => {
  const {
    networkData: { units },
  } = useNetwork()

  return (
    <TokenFiat Token={Token}>
      <h1>
        <Odometer
          value={minDecimalPlaces(new BigNumber(value).toFormat(units), 2)}
          zeroDecimals={2}
        />
      </h1>
      <h3>
        <Value tokenBalance={value} currency={currency} />
      </h3>
    </TokenFiat>
  )
}
