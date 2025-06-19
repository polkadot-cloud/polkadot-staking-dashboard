// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import {
  faAdd,
  faArrowDown,
  faChartLine,
  faCircleDown,
  faCircleXmark,
  faCoins,
  faEnvelope,
  faMinus,
  faPaperPlane,
  faQuestionCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import PolkadotVaultSVG from 'assets/brands/vault.svg?react'
import { DiscordSupportUrl, MailSupportAddress } from 'consts'
import { CardWrapper } from 'library/Card/Wrappers'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { BondFor } from 'types'
import { QuickAction } from 'ui-buttons'
import type { ButtonQuickActionProps } from 'ui-buttons/types'
import { CardHeader, Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { useActiveAccounts } from '../../contexts/ActiveAccounts'
import { useBalances } from '../../contexts/Balances'
import { useNominatorSetups } from '../../contexts/NominatorSetups'
import { usePayouts } from '../../contexts/Payouts'
import { useActivePool } from '../../contexts/Pools/ActivePool'
import { useStaking } from '../../contexts/Staking'
import { useSyncing } from '../../hooks/useSyncing'
import { CompactStakeInfo } from './CompactStakeInfo'
import { NetworkStats } from './NetworkStats'
import { PriceWidget } from './PriceWidget'
import { StakingHealth } from './StakingHealth'
import { StakingProgress } from './StakingProgress'
import { StakingRecommendation } from './StakingRecommendation'
import { WalletBalance } from './WalletBalance'
import { WelcomeSection } from './WelcomeSection'
import { BalanceCardsLayout, CardRow } from './Wrappers'

// Disconnected user actions
const DisconnectedActions = memo(() => {
  const { t } = useTranslation()
  const { openModal } = useOverlay().modal

  const actions: ButtonQuickActionProps[] = useMemo(
    () => [
      {
        onClick: () => {
          openModal({ key: 'Accounts' })
        },
        disabled: false,
        Icon: () => (
          <FontAwesomeIcon transform="grow-2" icon={faQuestionCircle} />
        ),
        label: t('accounts', { ns: 'app' }),
      },
      {
        onClick: () => {
          openModal({
            key: 'ImportAccounts',
            size: 'sm',
            options: { source: 'ledger' },
          })
        },
        disabled: false,
        Icon: () => (
          <LedgerSquareSVG style={{ width: '1.5rem', height: '1.5rem' }} />
        ),
        label: 'Ledger',
      },
      {
        onClick: () => {
          openModal({
            key: 'ImportAccounts',
            size: 'sm',
            options: { source: 'polkadot_vault' },
          })
        },
        disabled: false,
        Icon: () => (
          <PolkadotVaultSVG
            style={{
              width: '1.5rem',
              height: '1.5rem',
              fill: 'var(--text-color-primary)',
            }}
          />
        ),
        label: 'Vault',
      },
      {
        onClick: () => {
          window.open(`mailto:${MailSupportAddress}`, '_blank')
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faEnvelope} />,
        label: t('email', { ns: 'app' }),
      },
      {
        onClick: () => {
          window.open(DiscordSupportUrl, '_blank')
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faDiscord} />,
        label: 'Discord',
      },
    ],
    [t, openModal]
  )

  return (
    <QuickAction.Container>
      {actions.map((action, i) => (
        <QuickAction.Button key={`action-${i}`} {...action} />
      ))}
    </QuickAction.Container>
  )
})

DisconnectedActions.displayName = 'DisconnectedActions'

// Not staking user actions
const NotStakingActions = memo(() => {
  const { t } = useTranslation('pages')
  const { openCanvas } = useOverlay().canvas
  const { openModal } = useOverlay().modal
  const { setNominatorSetup, generateOptimalSetup } = useNominatorSetups()

  const actions: ButtonQuickActionProps[] = useMemo(
    () => [
      {
        onClick: () => {
          openCanvas({
            key: 'Pool',
            size: 'xl',
          })
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-1" icon={faUsers} />,
        label: t('joinPool'),
      },
      {
        onClick: () => {
          // Set optimal nominator setup here, ready for canvas to display summary
          setNominatorSetup(generateOptimalSetup(), true, 4)
          openCanvas({
            key: 'NominatorSetup',
            options: {
              simple: true,
            },
            size: 'xl',
          })
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-1" icon={faChartLine} />,
        label: t('startNominating'),
      },
      {
        onClick: () => {
          openModal({ key: 'Send', size: 'sm' })
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faPaperPlane} />,
        label: t('send'),
      },
      {
        onClick: () => {
          window.open(`mailto:${MailSupportAddress}`, '_blank')
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faEnvelope} />,
        label: t('email', { ns: 'app' }),
      },
      {
        onClick: () => {
          window.open(DiscordSupportUrl, '_blank')
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faDiscord} />,
        label: 'Discord',
      },
    ],
    [t, openCanvas, openModal, setNominatorSetup, generateOptimalSetup]
  )

  return (
    <QuickAction.Container>
      {actions.map((action, i) => (
        <QuickAction.Button key={`action-${i}`} {...action} />
      ))}
    </QuickAction.Container>
  )
})

NotStakingActions.displayName = 'NotStakingActions'

// Staking user actions
const StakingActions = memo(({ bondFor }: { bondFor: BondFor }) => {
  const { t } = useTranslation('pages')
  const { openModal } = useOverlay().modal
  const { unclaimedRewards } = usePayouts()
  const { activeAddress } = useActiveAccounts()
  const { getPendingPoolRewards } = useBalances()

  const pendingRewards = getPendingPoolRewards(activeAddress)

  const actions: ButtonQuickActionProps[] = useMemo(() => {
    const actionList: ButtonQuickActionProps[] = []

    if (bondFor === 'pool') {
      actionList.push(
        {
          onClick: () => {
            openModal({
              key: 'ClaimReward',
              options: { claimType: 'withdraw' },
              size: 'sm',
            })
          },
          disabled: pendingRewards === 0n,
          Icon: () => (
            <FontAwesomeIcon transform="grow-2" icon={faCircleDown} />
          ),
          label: t('withdraw'),
        },
        {
          onClick: () => {
            openModal({
              key: 'ClaimReward',
              options: { claimType: 'bond' },
              size: 'sm',
            })
          },
          disabled: pendingRewards === 0n,
          Icon: () => <FontAwesomeIcon transform="grow-2" icon={faCoins} />,
          label: t('compound'),
        }
      )
    } else {
      actionList.push({
        onClick: () => {
          openModal({
            key: 'ClaimPayouts',
            size: 'sm',
          })
        },
        disabled: BigInt(unclaimedRewards.total) === 0n,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faCircleDown} />,
        label: t('claim', { ns: 'modals' }),
      })
    }

    actionList.push(
      {
        onClick: () => {
          openModal({
            key: 'Bond',
            options: { bondFor },
            size: 'sm',
          })
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faAdd} />,
        label: t('bond', { ns: 'pages' }),
      },
      {
        onClick: () => {
          openModal({
            key: 'Unbond',
            options: { bondFor },
            size: 'sm',
          })
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faMinus} />,
        label: t('unbond', { ns: 'pages' }),
      }
    )

    if (bondFor === 'nominator') {
      actionList.push(
        {
          onClick: () => {
            openModal({ key: 'UpdatePayee', size: 'sm' })
          },
          disabled: false,
          Icon: () => <FontAwesomeIcon transform="grow-2" icon={faArrowDown} />,
          label: t('payee.label', { ns: 'app' }),
        },
        {
          onClick: () => {
            openModal({
              key: 'Unstake',
              size: 'sm',
            })
          },
          disabled: false,
          Icon: () => (
            <FontAwesomeIcon transform="grow-2" icon={faCircleXmark} />
          ),
          label: t('stop', { ns: 'pages' }),
        }
      )
    } else {
      actionList.push({
        onClick: () => {
          openModal({
            key: 'LeavePool',
            size: 'sm',
          })
        },
        disabled: false,
        Icon: () => <FontAwesomeIcon transform="grow-2" icon={faCircleXmark} />,
        label: t('stop', { ns: 'pages' }),
      })
    }

    return actionList
  }, [bondFor, pendingRewards, unclaimedRewards.total, t, openModal])

  return (
    <QuickAction.Container>
      {actions.map((action, i) => (
        <QuickAction.Button key={`action-${i}`} {...action} />
      ))}
    </QuickAction.Container>
  )
})

StakingActions.displayName = 'StakingActions'

// Main QuickActions component
const QuickActionsInner = ({ height }: { height?: number }) => {
  const { t } = useTranslation('pages')
  const { inPool } = useActivePool()
  const { isNominator } = useStaking()
  const { accountSynced } = useSyncing()
  const { activeAddress } = useActiveAccounts()

  const isStaking = inPool || isNominator
  const syncing = !accountSynced(activeAddress)

  let actionGroup: 'disconnected' | 'notStaking' | 'staking' = 'staking'
  if (!activeAddress) {
    actionGroup = 'disconnected'
  } else if (!isStaking) {
    actionGroup = 'notStaking'
  }

  return (
    <CardWrapper style={{ padding: 0 }} height={height}>
      <CardHeader style={{ padding: '1.25rem 1rem 0.5rem 1.25rem' }}>
        <h4>{t('quickActions')}</h4>
      </CardHeader>
      {syncing ? (
        <QuickAction.Container>
          <QuickAction.PreloadingButton />
        </QuickAction.Container>
      ) : (
        <>
          {actionGroup === 'disconnected' && <DisconnectedActions />}
          {actionGroup === 'notStaking' && <NotStakingActions />}
          {actionGroup === 'staking' && (
            <StakingActions bondFor={inPool ? 'pool' : 'nominator'} />
          )}
        </>
      )}
    </CardWrapper>
  )
}

const QuickActions = memo(QuickActionsInner)
QuickActions.displayName = 'QuickActions'

export const Home = () => {
  const { t } = useTranslation('pages')
  const { isNominator } = useStaking()
  const { inPool } = useActivePool()
  const { activeAccount } = useActiveAccounts()

  // Check if user is staking
  const isStakingUser = isNominator || inPool

  // Define height for staking health card
  const STAKING_HEALTH_HEIGHT = 450

  return (
    <>
      <Page.Title title={t('home')} />

      {/* Only show additional cards if user has an active account */}
      {activeAccount && (
        <>
          {isStakingUser ? (
            <>
              {/* For actively staking users: Welcome and Quick Actions on the same row */}
              <Page.Row>
                <Page.RowSection>
                  <BalanceCardsLayout>
                    {/* Welcome Section */}
                    <CardWrapper className="welcome-section">
                      <WelcomeSection />
                    </CardWrapper>

                    {/* Quick Actions */}
                    <QuickActions />
                  </BalanceCardsLayout>
                </Page.RowSection>
              </Page.Row>

              {/* For actively staking users: Wallet Balance and Staking Info on the same row */}
              <Page.Row>
                <Page.RowSection>
                  <BalanceCardsLayout>
                    {/* Wallet Balance */}
                    <CardWrapper>
                      <WalletBalance />
                    </CardWrapper>

                    {/* Staking Info */}
                    <CardWrapper>
                      <CompactStakeInfo />
                    </CardWrapper>
                  </BalanceCardsLayout>
                </Page.RowSection>
              </Page.Row>
            </>
          ) : (
            <>
              {/* For non-staking users: Welcome Section at the top */}
              <Page.Row>
                <Page.RowSection>
                  <CardWrapper className="welcome-section">
                    <WelcomeSection />
                  </CardWrapper>
                </Page.RowSection>
              </Page.Row>

              {/* For non-staking users: Wallet Balance and Quick Actions side by side */}
              <Page.Row>
                <Page.RowSection>
                  <BalanceCardsLayout>
                    {/* Wallet Balance - Left */}
                    <CardWrapper>
                      <WalletBalance />
                    </CardWrapper>

                    {/* Quick Actions - Right */}
                    <QuickActions />
                  </BalanceCardsLayout>
                </Page.RowSection>
              </Page.Row>
            </>
          )}

          {/* Second Row: StakingProgress and StakingHealth - side by side */}
          <Page.Row>
            <Page.RowSection>
              <CardRow>
                {/* StakingProgress on the LEFT */}
                <CardWrapper
                  style={{
                    flex: 1,
                    minHeight: STAKING_HEALTH_HEIGHT,
                    overflow: 'visible',
                    paddingBottom: '3rem',
                  }}
                >
                  <StakingProgress />
                </CardWrapper>

                {/* StakingHealth on the RIGHT */}
                <CardWrapper
                  style={{
                    flex: 1,
                    minHeight: STAKING_HEALTH_HEIGHT,
                    overflow: 'visible',
                    paddingBottom: '3rem',
                  }}
                >
                  {isStakingUser ? (
                    <StakingHealth />
                  ) : (
                    <StakingRecommendation />
                  )}
                </CardWrapper>
              </CardRow>
            </Page.RowSection>
          </Page.Row>

          {/* Third Row: Token Price and Network Stats side by side */}
          <Page.Row>
            <Page.RowSection>
              <CardRow>
                {/* Token Price on the LEFT */}
                <CardWrapper style={{ flex: 1 }}>
                  <PriceWidget />
                </CardWrapper>

                {/* Network Stats on the RIGHT */}
                <CardWrapper style={{ flex: 1 }}>
                  <NetworkStats />
                </CardWrapper>
              </CardRow>
            </Page.RowSection>
          </Page.Row>
        </>
      )}

      {/* Show Welcome and Price Widget for users without an active account */}
      {!activeAccount && (
        <>
          {/* Welcome Section for non-connected users */}
          <Page.Row>
            <Page.RowSection>
              <CardWrapper>
                <WelcomeSection />
              </CardWrapper>
            </Page.RowSection>
          </Page.Row>

          {/* Price Widget for non-connected users */}
          <Page.Row>
            <Page.RowSection>
              <CardWrapper>
                <PriceWidget />
              </CardWrapper>
            </Page.RowSection>
          </Page.Row>
        </>
      )}
    </>
  )
}
