// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useHelp } from 'contexts/Help'
import { useStaking } from 'contexts/Staking'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { useUnstaking } from 'hooks/useUnstaking'
import { CardWrapper } from 'library/Card/Wrappers'
import { ListStatusHeader } from 'library/List'
import { Nominations } from 'library/Nominations'
import { WithdrawPrompt } from 'library/WithdrawPrompt'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonPrimary } from 'ui-buttons'
import { CardHeader, PageRow, RowSection, StatRow } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { CommissionPrompt } from './CommissionPrompt'
import { ManageBond } from './ManageBond'
import { ActiveNominators } from './Stats/ActiveNominators'
import { MinimumActiveStake } from './Stats/MinimumActiveStake'
import { MinimumNominatorBond } from './Stats/MinimumNominatorBond'
import { Status } from './Status'
import { UnstakePrompts } from './UnstakePrompts'

export const Active = () => {
  const { t } = useTranslation()
  const { openHelp } = useHelp()
  const { syncing } = useSyncing()
  const { getNominations } = useBalances()
  const { inSetup, isBonding } = useStaking()
  const { openCanvas } = useOverlay().canvas
  const { isFastUnstaking } = useUnstaking()
  const { formatWithPrefs } = useValidators()
  const { activeAccount } = useActiveAccounts()

  const nominated = formatWithPrefs(getNominations(activeAccount))
  const ROW_HEIGHT = 220

  return (
    <>
      <StatRow>
        <ActiveNominators />
        <MinimumNominatorBond />
        <MinimumActiveStake />
      </StatRow>
      <CommissionPrompt />

      {!isFastUnstaking && <WithdrawPrompt bondFor="nominator" />}
      <UnstakePrompts />
      <PageRow>
        <RowSection secondary vLast>
          <CardWrapper height={ROW_HEIGHT}>
            <ManageBond />
          </CardWrapper>
        </RowSection>
        <RowSection hLast>
          <Status height={ROW_HEIGHT} />
        </RowSection>
      </PageRow>
      {isBonding() && (
        <PageRow>
          <CardWrapper>
            {nominated?.length || inSetup() || syncing ? (
              <Nominations bondFor="nominator" nominator={activeAccount} />
            ) : (
              <>
                <CardHeader action margin>
                  <h3>
                    {t('nominate.nominate', { ns: 'pages' })}
                    <ButtonHelp
                      marginLeft
                      onClick={() => openHelp('Nominations')}
                    />
                  </h3>
                  <div>
                    <ButtonPrimary
                      iconLeft={faChevronCircleRight}
                      iconTransform="grow-1"
                      text={`${t('nominate.nominate', { ns: 'pages' })}`}
                      disabled={inSetup() || syncing || isFastUnstaking}
                      onClick={() =>
                        openCanvas({
                          key: 'ManageNominations',
                          scroll: false,
                          options: {
                            bondFor: 'nominator',
                            nominator: activeAccount,
                            nominated,
                          },
                          size: 'xl',
                        })
                      }
                    />
                  </div>
                </CardHeader>
                <ListStatusHeader>
                  {t('notNominating', { ns: 'library' })}.
                </ListStatusHeader>
              </>
            )}
          </CardWrapper>
        </PageRow>
      )}
    </>
  )
}
