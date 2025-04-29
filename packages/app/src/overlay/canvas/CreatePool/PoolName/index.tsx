// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useSetup } from 'contexts/Setup'
import type { PoolProgress } from 'contexts/Setup/types'
import { Footer } from 'library/SetupSteps/Footer'
import { Header } from 'library/SetupSteps/Header'
import { MotionContainer } from 'library/SetupSteps/MotionContainer'
import type { SetupStepProps } from 'library/SetupSteps/types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from './Input'

export const PoolName = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages')
  const { activeAddress } = useActiveAccounts()
  const { getPoolSetup, setActiveAccountSetup } = useSetup()
  const setup = getPoolSetup(activeAddress)
  const { progress } = setup

  const initialValue = progress.metadata

  // store local pool name for form control
  const [metadata, setMetadata] = useState<{ metadata: string }>({
    metadata: initialValue,
  })

  // pool name valid
  const [valid, setValid] = useState<boolean>(initialValue !== '')

  // handler for updating bond
  const handleSetupUpdate = (value: PoolProgress) => {
    setActiveAccountSetup('pool', value)
  }

  // update bond on account change
  useEffect(() => {
    setMetadata({
      metadata: initialValue,
    })
  }, [activeAddress])

  // apply initial metadata to setup progress
  useEffect(() => {
    // only update if this section is currently active
    if (setup.section === section) {
      setActiveAccountSetup('pool', {
        ...progress,
        metadata: initialValue,
      })
    }
  }, [setup.section])

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.metadata !== ''}
        title={t('poolName')}
        bondFor="pool"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Input
          listenIsValid={setValid}
          defaultValue={initialValue}
          setters={[
            {
              set: handleSetupUpdate,
              current: progress,
            },
            {
              set: setMetadata,
              current: metadata,
            },
          ]}
        />
        <Footer complete={valid} bondFor="pool" />
      </MotionContainer>
    </>
  )
}
