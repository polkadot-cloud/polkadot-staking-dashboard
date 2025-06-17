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
import { CardHeader, Page, Stat } from 'ui-core/base'
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
  const { openCanvas } = useOverlay().canvas
  const { isFastUnstaking } = useUnstaking()
  const { formatWithPrefs } = useValidators()
  const { activeAddress } = useActiveAccounts()
  const { isNominator, isBonding } = useStaking()

  const nominated = formatWithPrefs(getNominations(activeAddress))
  const ROW_HEIGHT = 220

  return (
    <>
      <Stat.Row>
        <ActiveNominators />
        <MinimumNominatorBond />
        <MinimumActiveStake />
      </Stat.Row>
      <CommissionPrompt />

      {!isFastUnstaking && <WithdrawPrompt bondFor="nominator" />}
      <UnstakePrompts />
      <Page.Row>
        <Page.RowSection secondary vLast>
          <CardWrapper height={ROW_HEIGHT}>
            <ManageBond />
          </CardWrapper>
        </Page.RowSection>
        <Page.RowSection hLast>
          <Status height={ROW_HEIGHT} />
        </Page.RowSection>
      </Page.Row>
      {isBonding && (
        <Page.Row>
          <CardWrapper>
            {nominated?.length || !isNominator || syncing ? (
              <Nominations bondFor="nominator" nominator={activeAddress} />
            ) : (
              <>
                <CardHeader action margin>
                  <h3>
                    {t('nominate', { ns: 'pages' })}
                    <ButtonHelp
                      marginLeft
                      onClick={() => openHelp('Nominations')}
                    />
                  </h3>
                  <div>
                    <ButtonPrimary
                      size="md"
                      iconLeft={faChevronCircleRight}
                      iconTransform="grow-1"
                      text={`${t('nominate', { ns: 'pages' })}`}
                      disabled={!isNominator || syncing || isFastUnstaking}
                      onClick={() =>
                        openCanvas({
                          key: 'ManageNominations',
                          scroll: false,
                          options: {
                            bondFor: 'nominator',
                            nominator: activeAddress,
                            nominated,
                          },
                        })
                      }
                    />
                  </div>
                </CardHeader>
                <ListStatusHeader>
                  {t('notNominating', { ns: 'app' })}.
                </ListStatusHeader>
              </>
            )}
          </CardWrapper>
        </Page.Row>
      )}
    </>
  )
}
