// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { Warning } from 'library/Form/Warning'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { MaybeAddress } from 'types'
import {
  SummaryContainer,
  SummaryRow,
  WarningsContainer,
} from '../pages/Wrappers'

interface SummaryStepProps {
  selectedValidatorsCount: number
  bondAmount: string
  isNewNominator: boolean
  warnings: string[]
  payee?: { type: string | null }
  payeeAccount?: MaybeAddress
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  selectedValidatorsCount,
  bondAmount,
  isNewNominator,
  warnings,
  payee = { type: 'Stash' },
  payeeAccount = null,
}) => {
  const { t } = useTranslation('invite')
  const { network } = useNetwork()
  const { unit } = getNetworkData(network)
  const { getPayeeItems } = usePayeeConfig()

  // Get the display name for the selected payout destination
  const getPayoutDisplay = () => {
    if (!payee.type) {
      return ''
    }

    // Find the display name from the payee items
    const payeeItem = getPayeeItems().find((item) => item.value === payee.type)

    if (payeeItem) {
      if (payee.type === 'Account' && payeeAccount) {
        return `${payeeItem.title}: ${ellipsisFn(payeeAccount)}`
      }
      return payeeItem.title
    }

    return payee.type
  }

  return (
    <>
      <SummaryContainer>
        <SummaryRow>
          <span className="label">{t('selectedValidators')}</span>
          <span className="value">{selectedValidatorsCount}</span>
        </SummaryRow>
        <SummaryRow>
          <span className="label">{t('bondAmount')}</span>
          <span className="value">
            {new BigNumber(bondAmount || 0).toFormat()} {unit}
          </span>
        </SummaryRow>
        {isNewNominator && (
          <SummaryRow>
            <span className="label">{t('payoutDestination')}</span>
            <span className="value">{getPayoutDisplay()}</span>
          </SummaryRow>
        )}
      </SummaryContainer>

      {warnings.length > 0 && (
        <WarningsContainer>
          {warnings.map((text, i) => (
            <Warning key={`warning${i}`} text={text} />
          ))}
        </WarningsContainer>
      )}
    </>
  )
}
