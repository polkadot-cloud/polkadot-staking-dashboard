// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useSetup } from 'contexts/Setup'
import { Footer } from 'library/SetupSteps/Footer'
import { Header } from 'library/SetupSteps/Header'
import { MotionContainer } from 'library/SetupSteps/MotionContainer'
import { Subheading } from 'pages/Nominate/Wrappers'
import { useTranslation } from 'react-i18next'
import { GenerateNominations } from '../GenerateNominations'
import type { NominationsProps } from './types'

export const Nominate = ({ bondFor, section }: NominationsProps) => {
  const { t } = useTranslation('app')
  const { consts } = useApi()
  const { activeAccount } = useActiveAccounts()
  const { getNominatorSetup, getPoolSetup, setActiveAccountSetup } = useSetup()

  const setup =
    bondFor === 'nominator'
      ? getNominatorSetup(activeAccount)
      : getPoolSetup(activeAccount)

  const { progress } = setup
  const { maxNominations } = consts

  // Handler for updating setup.
  const handleSetupUpdate = (value: AnyJson) => {
    setActiveAccountSetup(bondFor, value)
  }

  return (
    <>
      <Header
        thisSection={section}
        complete={progress.nominations.length > 0}
        title={t('nominate')}
        helpKey="Nominating"
        bondFor={bondFor}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <Subheading>
          <h4>
            {t('chooseValidators', {
              maxNominations: maxNominations.toString(),
            })}
          </h4>
        </Subheading>
        <GenerateNominations
          setters={[
            {
              current: {
                callable: true,
                fn: () =>
                  (bondFor === 'nominator'
                    ? getNominatorSetup(activeAccount)
                    : getPoolSetup(activeAccount)
                  ).progress,
              },
              set: handleSetupUpdate,
            },
          ]}
          displayFor="modal"
          nominations={{ nominations: progress.nominations }}
        />

        <Footer complete={progress.nominations.length > 0} bondFor={bondFor} />
      </MotionContainer>
    </>
  )
}
