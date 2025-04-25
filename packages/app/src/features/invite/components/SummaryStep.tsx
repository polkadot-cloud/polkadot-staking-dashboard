// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { Warning } from 'library/Form/Warning'
import React from 'react'
import { useTranslation } from 'react-i18next'
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
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  selectedValidatorsCount,
  bondAmount,
  isNewNominator,
  warnings,
}) => {
  const { t } = useTranslation('invite')
  const { network } = useNetwork()
  const { unit } = getNetworkData(network)

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
            <span className="value">{t('stash')}</span>
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
