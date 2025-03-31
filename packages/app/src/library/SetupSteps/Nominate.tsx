// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import {
  ManageNominationsProvider,
  useManageNominations,
} from 'contexts/ManageNominations'
import { useSetup } from 'contexts/Setup'
import type { NominatorProgress } from 'contexts/Setup/types'
import { InlineControls } from 'library/GenerateNominations/Controls/InlineControls'
import { Footer } from 'library/SetupSteps/Footer'
import { Header } from 'library/SetupSteps/Header'
import { MotionContainer } from 'library/SetupSteps/MotionContainer'
import { Subheading } from 'pages/Nominate/Wrappers'
import { useTranslation } from 'react-i18next'
import type { DisplayFor } from 'types'
import { GenerateNominations } from '../GenerateNominations'
import type { NominationsProps } from './types'

export const Inner = ({ bondFor, section }: NominationsProps) => {
  const { t } = useTranslation('app')
  const { consts } = useApi()
  const { activeAccount } = useActiveAccounts()
  const { setNominations } = useManageNominations()
  const { getNominatorSetup, getPoolSetup, setActiveAccountSetup } = useSetup()

  const setup =
    bondFor === 'nominator'
      ? getNominatorSetup(activeAccount)
      : getPoolSetup(activeAccount)

  const { progress } = setup
  const { maxNominations } = consts

  // Handler for updating setup.
  const handleSetupUpdate = (value: NominatorProgress) => {
    setNominations(value.nominations)
    setActiveAccountSetup(bondFor, value)
  }

  // Generation component props
  const displayFor: DisplayFor = 'modal'
  const setters = [
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
  ]

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
        <InlineControls displayFor={displayFor} allowRevert setters={setters} />
        <GenerateNominations setters={setters} displayFor={displayFor} />
        <Footer complete={progress.nominations.length > 0} bondFor={bondFor} />
      </MotionContainer>
    </>
  )
}

export const Nominate = (props: NominationsProps) => {
  const { activeAccount } = useActiveAccounts()
  const { getNominatorSetup, getPoolSetup } = useSetup()
  const setup =
    props.bondFor === 'nominator'
      ? getNominatorSetup(activeAccount)
      : getPoolSetup(activeAccount)

  const { progress } = setup

  return (
    <ManageNominationsProvider nominations={progress.nominations}>
      <Inner {...props} />
    </ManageNominationsProvider>
  )
}
