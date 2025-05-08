// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Spacer } from 'library/Form/Wrappers'
import { PayeeInput } from 'library/PayeeInput'
import { SelectItems } from 'library/SelectItems'
import { SelectItem } from 'library/SelectItems/Item'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { MaybeAddress } from 'types'
import { PayeeInputContainer, StepDescription } from '../pages/Wrappers'

interface PayeeItem {
  value: 'Stash' | 'Staked' | 'Account' | 'None' | 'Controller'
  icon: IconProp
  title: string
  subtitle: string
}

// Define a type for the setAccount function that matches what SelectItem and PayeeInput expect
type SetAccountFn = React.Dispatch<React.SetStateAction<MaybeAddress>>

interface PayoutDestinationStepProps {
  payee: { type: string }
  payeeAccount: MaybeAddress
  handlePayeeChange: (
    destination: 'Stash' | 'Staked' | 'Account' | 'None' | 'Controller'
  ) => void
  handlePayeeAccountChange: (account: MaybeAddress) => void
  getPayeeItems: (extended?: boolean) => PayeeItem[]
}

export const PayoutDestinationStep: React.FC<PayoutDestinationStepProps> = ({
  payee,
  payeeAccount,
  handlePayeeChange,
  handlePayeeAccountChange,
  getPayeeItems,
}) => {
  const { t } = useTranslation('invite')

  // Create a wrapper function that conforms to the expected SetAccountFn type
  const setAccountWrapper: SetAccountFn = (value) => {
    if (typeof value === 'function') {
      // If it's a function, call it with the current account and pass the result
      const newValue = value(payeeAccount)
      handlePayeeAccountChange(newValue)
    } else {
      // If it's a direct value, just pass it through
      handlePayeeAccountChange(value)
    }
  }

  return (
    <>
      <StepDescription>{t('payoutDestinationInfo')}</StepDescription>
      <SelectItems layout="three-col">
        {getPayeeItems().map((item) => (
          <SelectItem
            key={`payee_option_${item.value}`}
            account={payeeAccount}
            setAccount={setAccountWrapper}
            selected={payee.type === item.value}
            onClick={() => handlePayeeChange(item.value)}
            layout="three-col"
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
          />
        ))}
      </SelectItems>

      <Spacer />

      {payee.type === 'Account' && (
        <PayeeInputContainer>
          <PayeeInput
            payee={{
              destination: payee.type,
              account: payeeAccount,
            }}
            account={payeeAccount}
            setAccount={setAccountWrapper}
            handleChange={handlePayeeAccountChange}
          />
        </PayeeInputContainer>
      )}

      {payee.type === 'Stash' && (
        <StepDescription>{t('usingStashForPayouts')}</StepDescription>
      )}
    </>
  )
}
