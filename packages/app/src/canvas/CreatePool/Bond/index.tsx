// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { usePoolSetups } from 'contexts/PoolSetups'
import { useTxMeta } from 'contexts/TxMeta'
import { BondFeedback } from 'library/Form/Bond/BondFeedback'
import { CreatePoolStatusBar } from 'library/Form/CreatePoolStatusBar'
import { Footer } from 'library/SetupSteps/Footer'
import { Header } from 'library/SetupSteps/Header'
import { MotionContainer } from 'library/SetupSteps/MotionContainer'
import type { SetupStepProps } from 'library/SetupSteps/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Bond = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages')
  const { getTxSubmissionByTag } = useTxMeta()
  const { activeAddress } = useActiveAccounts()
  const { getPoolSetup, setPoolSetup } = usePoolSetups()

  const txSubmission = getTxSubmissionByTag('createPool')
  const fee = txSubmission?.fee || 0n

  const setup = getPoolSetup(activeAddress)
  const { progress } = setup

  // either free to bond or existing setup value
  const initialBondValue = progress.bond === '0' ? '' : progress.bond

  // store local bond amount for form control
  const [bond, setBond] = useState<{ bond: string }>({
    bond: initialBondValue,
  })

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false)

  // handler for updating bond
  const handleSetBond = (value: { bond: BigNumber }) => {
    // set this form's bond value.
    setBond({
      bond: value.bond.toString(),
    })
    // set pool progress bond value.
    setPoolSetup({
      ...progress,
      bond: value.bond.toString(),
    })
  }

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: initialBondValue,
    })
  }, [activeAddress])

  // apply initial bond value to setup progress
  useEffect(() => {
    // only update if Bond is currently active
    if (setup.section === section) {
      setPoolSetup({
        ...progress,
        bond: initialBondValue,
      })
    }
  }, [setup.section])

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.bond !== '0' && progress.bond !== ''}
        title={t('bond')}
        bondFor="pool"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <BondFeedback
          syncing={fee === 0n}
          bondFor="pool"
          bonding={false}
          listenIsValid={(valid) => setBondValid(valid)}
          defaultBond={initialBondValue}
          setters={[handleSetBond]}
          txFees={fee}
          maxWidth
        />
        <CreatePoolStatusBar value={new BigNumber(bond.bond)} />
        <Footer complete={bondValid} bondFor="pool" />
      </MotionContainer>
    </>
  )
}
