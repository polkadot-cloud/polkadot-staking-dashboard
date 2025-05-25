// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useTxMeta } from 'contexts/TxMeta'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'
import { Wrapper } from './Wrapper'
import type { EstimatedTxFeeProps } from './types'

export const EstimatedTxFee = ({ uid, format }: EstimatedTxFeeProps) => {
  const { t } = useTranslation('app')
  const { network } = useNetwork()
  const { getTxSubmission } = useTxMeta()
  const { unit, units } = getStakingChainData(network)

  const txSubmission = getTxSubmission(uid)
  const fee = txSubmission?.fee || 0n

  const txFeesUnit = planckToUnitBn(new BigNumber(fee), units).toFormat()

  return format === 'table' ? (
    <>
      <div>{t('estimatedFee')}:</div>
      <div>{fee === 0n ? `...` : `${txFeesUnit} ${unit}`}</div>
    </>
  ) : (
    <Wrapper>
      <p>
        <span>{t('estimatedFee')}:</span>
        {fee === 0n ? `...` : `${txFeesUnit} ${unit}`}
      </p>
    </Wrapper>
  )
}
