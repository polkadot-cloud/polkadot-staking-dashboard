// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { usePoolSetups } from 'contexts/PoolSetups'
import type { PoolProgress } from 'contexts/PoolSetups/types'
import { Footer } from 'library/SetupSteps/Footer'
import { Header } from 'library/SetupSteps/Header'
import { MotionContainer } from 'library/SetupSteps/MotionContainer'
import type { SetupStepProps } from 'library/SetupSteps/types'
import { Roles } from 'pages/Pools/Roles'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import type { PoolRoles as PoolRolesInterface } from 'types'

export const PoolRoles = ({ section }: SetupStepProps) => {
  const { t } = useTranslation('pages')
  const { activeAddress } = useActiveAccounts()
  const { getPoolSetup, setPoolSetup } = usePoolSetups()
  const setup = getPoolSetup(activeAddress)
  const { progress } = setup

  // if no roles in setup already, inject `activeAddress` to be
  // root and depositor roles.
  const initialValue = progress.roles ?? {
    root: activeAddress,
    depositor: activeAddress,
    nominator: activeAddress,
    bouncer: activeAddress,
  }

  // store local pool name for form control
  const [roles, setRoles] = useState<{ roles: PoolRolesInterface }>({
    roles: initialValue,
  })

  // pool name valid
  const [rolesValid, setRolesValid] = useState<boolean>(true)

  // handler for updating pool roles
  const handleSetupUpdate = (value: PoolProgress) => {
    setPoolSetup(value)
  }

  // update pool roles on account change
  useEffect(() => {
    setRoles({
      roles: initialValue,
    })
  }, [activeAddress])

  // apply initial pool roles to setup progress
  useEffect(() => {
    // only update if this section is currently active
    if (setup.section === section) {
      setPoolSetup({
        ...progress,
        roles: initialValue,
      })
    }
  }, [setup.section])

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.roles !== null}
        title={t('roles')}
        helpKey="Pool Roles"
        bondFor="pool"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <h4 style={{ margin: '0.5rem 0' }}>
          <Trans defaults={t('poolCreator')} components={{ b: <b /> }} />
        </h4>
        <h4 style={{ margin: '0.5rem 0 1.5rem 0' }}>
          <Trans
            defaults={t('assignedToAnyAccount')}
            components={{ b: <b /> }}
          />
        </h4>
        <Roles
          inline
          listenIsValid={setRolesValid}
          defaultRoles={initialValue}
          setters={[
            {
              set: handleSetupUpdate,
              current: progress,
            },
            {
              set: setRoles,
              current: roles,
            },
          ]}
        />
        <Footer complete={rolesValid} bondFor="pool" />
      </MotionContainer>
    </>
  )
}
