// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network'
import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'

import { getStakingChainData } from 'consts/util'
import type { AnalyzedPayoutsProps } from '../types'

// We simply report the size of payouts that have been analyzed for decentralization purpose

export const AnalyzedPayouts = ({ data }: AnalyzedPayoutsProps) => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { unit } = getStakingChainData(network)

  const params = {
    label: t('totalPayoutsAnalysed'),
    value:
      data?.nodeDistributionDetail?.reduce(
        (acc, node) => acc + node.TokenRewards,
        0
      ) || 0,
    decimals: 1,
    unit,
    helpKey: 'Total Payouts Analysed',
  }
  return <Number {...params} />
}
