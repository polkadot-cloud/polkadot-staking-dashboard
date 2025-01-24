// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { useTooltip } from 'contexts/Tooltip'
import type { Pool } from 'library/Pool/types'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'
import { planckToUnitBn } from 'utils'

export const PoolBonded = ({ pool }: { pool: Pool }) => {
  const { t } = useTranslation('library')
  const {
    networkData: {
      units,
      brand: { token },
    },
  } = useNetwork()
  const { setTooltipTextAndOpen } = useTooltip()

  const tooltipText = t('bonded')

  const { points } = pool
  const TokenIcon = token

  // Format total bonded pool amount.
  const bonded = planckToUnitBn(new BigNumber(rmCommas(points)), units)

  return (
    <Label>
      <TooltipArea
        text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />

      <TokenIcon
        style={{
          maxWidth: '1.25rem',
          height: '1.25rem',
          marginRight: '0.25rem',
        }}
      />
      {bonded.decimalPlaces(0).toFormat()}
    </Label>
  )
}
