// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNominatorSetups } from 'contexts/NominatorSetups'
import { usePoolSetups } from 'contexts/PoolSetups'
import { useTranslation } from 'react-i18next'
import { ButtonSecondary } from 'ui-buttons'
import type { HeaderProps } from '../types'
import classes from './index.module.scss'

export const Header = ({
  title,
  complete,
  thisSection,
  bondFor,
}: HeaderProps) => {
  const { t } = useTranslation('app')
  const { activeAddress } = useActiveAccounts()
  const { getPoolSetup, setPoolSetupSection } = usePoolSetups()
  const { getNominatorSetup, setNominatorSetupSection } = useNominatorSetups()

  const setup =
    bondFor === 'nominator'
      ? getNominatorSetup(activeAddress)
      : getPoolSetup(activeAddress)

  return (
    <div className={classes.wrapper}>
      <section>
        <h2>{title}</h2>
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
    </div>
  )
}
