// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useHelp } from 'contexts/Help'
import { useNominatorSetups } from 'contexts/NominatorSetups'
import { usePoolSetups } from 'contexts/PoolSetups'
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
  const { activeAddress } = useActiveAccounts()
  const { getPoolSetup, setPoolSetupSection } = usePoolSetups()
  const { getNominatorSetup, setNominatorSetupSection } = useNominatorSetups()

  const setup =
    bondFor === 'nominator'
      ? getNominatorSetup(activeAddress)
      : getPoolSetup(activeAddress)

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
                    if (bondFor === 'nominator') {
                      setNominatorSetupSection(thisSection)
                    } else {
                      setPoolSetupSection(thisSection)
                    }
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
