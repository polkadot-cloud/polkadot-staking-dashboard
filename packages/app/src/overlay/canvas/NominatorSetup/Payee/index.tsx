// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useSetup } from 'contexts/Setup'
import type { PayeeOptions } from 'contexts/Setup/types'
import { defaultPayee } from 'controllers/Balances/defaults'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { Spacer } from 'library/Form/Wrappers'
import { PayeeInput } from 'library/PayeeInput'
import { SelectItems } from 'library/SelectItems'
import { SelectItem } from 'library/SelectItems/Item'
import { Footer } from 'library/SetupSteps/Footer'
import { Header } from 'library/SetupSteps/Header'
import { MotionContainer } from 'library/SetupSteps/MotionContainer'
import type { SetupStepProps } from 'library/SetupSteps/types'
import { Subheading } from 'pages/Nominate/Wrappers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MaybeAddress } from 'types'

export const Payee = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages')
  const { getPayeeItems } = usePayeeConfig()
  const { activeAddress } = useActiveAccounts()
  const { getNominatorSetup, setActiveAccountSetup } = useSetup()

  const setup = getNominatorSetup(activeAddress)
  const { progress } = setup
  const { payee } = progress

  // Store the current user-inputted custom payout account.
  const [account, setAccount] = useState<MaybeAddress>(payee.account)

  // determine whether this section is completed.
  const isComplete = () =>
    payee.destination !== null &&
    !(payee.destination === 'Account' && payee.account === null)

  // update setup progress with payee config.
  const handleChangeDestination = (destination: PayeeOptions) => {
    // set local value to update input element set setup payee
    setActiveAccountSetup('nominator', {
      ...progress,
      payee: { destination, account },
    })
  }

  // update setup progress with payee account.
  const handleChangeAccount = (newAccount: MaybeAddress) => {
    // set local value to update input element set setup payee
    setActiveAccountSetup('nominator', {
      ...progress,
      payee: { ...payee, account: newAccount },
    })
  }

  // set initial payee value to `Staked` if not yet set.
  useEffect(() => {
    if (!payee || (!payee.destination && !payee.account)) {
      setActiveAccountSetup('nominator', {
        ...progress,
        payee: defaultPayee,
      })
    }
  }, [activeAddress])

  return (
    <>
      <Header
        thisSection={section}
        complete={isComplete()}
        title={t('payoutDestination')}
        helpKey="Payout Destination"
        bondFor="nominator"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Subheading>
          <h4>{t('payoutDestinationSubtitle')}</h4>
        </Subheading>

        <SelectItems layout="three-col">
          {getPayeeItems().map((item) => (
            <SelectItem
              key={`payee_option_${item.value}`}
              account={account}
              setAccount={setAccount}
              selected={payee.destination === item.value}
              onClick={() => handleChangeDestination(item.value)}
              layout="three-col"
              {...item}
            />
          ))}
        </SelectItems>
        <Spacer />
        <PayeeInput
          payee={payee}
          account={account}
          setAccount={setAccount}
          handleChange={handleChangeAccount}
        />
        <Footer complete={isComplete()} bondFor="nominator" />
      </MotionContainer>
    </>
  )
}
