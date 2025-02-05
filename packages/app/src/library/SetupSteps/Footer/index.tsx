// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useSetup } from 'contexts/Setup'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import type { FooterProps } from '../types'
import { Wrapper } from './Wrapper'

export const Footer = ({ complete, bondFor }: FooterProps) => {
  const { t } = useTranslation('library')
  const { activeAccount } = useActiveAccounts()
  const { getPoolSetup, getNominatorSetup, setActiveAccountSetupSection } =
    useSetup()

  const setup =
    bondFor === 'nominator'
      ? getNominatorSetup(activeAccount)
      : getPoolSetup(activeAccount)

  return (
    <Wrapper>
      <section>
        {complete ? (
          <ButtonPrimary
            lg
            text={t('continue')}
            onClick={() =>
              setActiveAccountSetupSection(bondFor, setup.section + 1)
            }
          />
        ) : (
          <div style={{ opacity: 0.5 }}>
            <ButtonPrimary text={t('continue')} disabled lg />
          </div>
        )}
      </section>
    </Wrapper>
  )
}
