// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useHelp } from 'contexts/Help'
import { useSetup } from 'contexts/Setup'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonSecondary } from 'ui-buttons'
import type { HeaderProps } from '../types'
import { Wrapper } from './Wrapper'

export const Header = ({
  title,
  helpKey,
  complete,
  thisSection,
  bondFor,
}: HeaderProps) => {
  const { t } = useTranslation('app')
  const { openHelp } = useHelp()
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
        <h2>
          {title}
          {helpKey !== undefined ? (
            <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
          ) : null}
        </h2>
      </section>
      <section>
        {complete && (
          <>
            {setup.section !== thisSection && thisSection < setup.section && (
              <span>
                <ButtonSecondary
                  text={t('update')}
                  onClick={() => {
                    setActiveAccountSetupSection(bondFor, thisSection)
                  }}
                />
              </span>
            )}
            <h4 className="complete">{t('complete')}</h4>
          </>
        )}
      </section>
    </Wrapper>
  )
}
