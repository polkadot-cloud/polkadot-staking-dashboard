// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { usePoolSetups } from 'contexts/PoolSetups'
import { useSetup } from 'contexts/Setup'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import type { FooterProps } from '../types'
import { Wrapper } from './Wrapper'

export const Footer = ({ complete, bondFor }: FooterProps) => {
  const { t } = useTranslation('app')
  const { activeAddress } = useActiveAccounts()
  const { getPoolSetup, setPoolSetupSection } = usePoolSetups()
  const { getNominatorSetup, setActiveAccountSetupSection } = useSetup()

  const setup =
    bondFor === 'nominator'
      ? getNominatorSetup(activeAddress)
      : getPoolSetup(activeAddress)

  return (
    <Wrapper>
      <section>
        {complete ? (
          <ButtonPrimary
            size="lg"
            text={t('continue')}
            onClick={() => {
              const newSection = setup.section + 1
              if (bondFor === 'nominator') {
                setActiveAccountSetupSection(bondFor, newSection)
              } else {
                setPoolSetupSection(newSection)
              }
            }}
          />
        ) : (
          <div style={{ opacity: 0.5 }}>
            <ButtonPrimary text={t('continue')} disabled size="lg" />
          </div>
        )}
      </section>
    </Wrapper>
  )
}
