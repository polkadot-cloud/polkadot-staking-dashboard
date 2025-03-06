// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
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
  const {
    network,
    networkData: { units },
  } = useNetwork()
  const { pluginEnabled } = usePlugins()

  const showFiat = pluginEnabled('staking_api') && network !== 'westend'

  // If the plugin is not enabled, or the network is Westend, we don't show the fiat value
  if (!showFiat) {
    return <Value tokenBalance={value} currency={currency} />
  }

  // Show token balance with fiat value
  return (
    <TokenFiat Token={Token}>
      <h1>
        <Odometer
          value={minDecimalPlaces(new BigNumber(value).toFormat(units), 2)}
          zeroDecimals={2}
        />
        {label && <CardLabel>&nbsp;{label}</CardLabel>}
      </h1>
      <h3>
        <Value tokenBalance={value} currency={currency} />
      </h3>
    </TokenFiat>
  )
}
