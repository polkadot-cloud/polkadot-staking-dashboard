// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import { BondFeedback } from 'library/Form/Bond/BondFeedback'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StepDescription } from '../pages/Wrappers'

interface BondAmountStepProps {
  unit: string | number
  bondAmount: string
  handleSetBond: (value: { bond: BigNumber }) => void
  setBondValid: (valid: boolean) => void
  setFeedbackErrors: (errors: string[]) => void
  largestTxFee: BigNumber
}

export const BondAmountStep: React.FC<BondAmountStepProps> = ({
  unit,
  bondAmount,
  handleSetBond,
  setBondValid,
  setFeedbackErrors,
  largestTxFee,
}) => {
  const { t } = useTranslation('invite')

  return (
    <>
      <StepDescription>{t('bondDescription', { unit })}</StepDescription>
      <BondFeedback
        bondFor="nominator"
        displayFirstWarningOnly
        syncing={largestTxFee.isZero()}
        listenIsValid={(valid, errors) => {
          setBondValid(valid)
          setFeedbackErrors(errors)
        }}
        defaultBond={bondAmount !== '' ? bondAmount : null}
        setters={[handleSetBond]}
        txFees={BigInt(largestTxFee.toString())}
        maxWidth
      />
    </>
  )
}
