// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChartLine,
  faCoins,
  faExclamationTriangle,
  faLightbulb,
  faPercent,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Odometer } from '@w3ux/react-odometer'
import { minDecimalPlaces } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { usePayouts } from 'contexts/Payouts'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { CardWrapper } from 'library/Card/Wrappers'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ButtonPrimary } from 'ui-buttons'
import { PageHeading, PageRow, PageTitle } from 'ui-core/base'
import { planckToUnitBn } from 'utils'
import { Value } from '../Overview/AccountBalance/Value'
import { AccountHeader } from './AccountHeader'

import {
  ActionsRow,
  BalanceContainer,
  CardContentHeader,
  MetricsContainer,
  OverviewCard,
  PoolHealth,
  StatRow,
  StatusBadge,
  WarningBox,
} from './Wrappers'

export const EasyMode = () => {
  const { t } = useTranslation('pages')
  const navigate = useNavigate()
  const { activeAccount } = useActiveAccounts()
  const {
    networkData: { units, unit, brand },
  } = useNetwork()
  const { getBalance, getLocks } = useBalances()
  const { getTransferOptions } = useTransferOptions()
  const { isNominating } = useStaking()
  const { unclaimedRewards } = usePayouts()

  useEffect(() => {
    localStorage.setItem('stakingMode', 'easy')
  }, [])

  const handleSwitchToAdvanced = () => {
    localStorage.setItem('stakingMode', 'advanced')
    navigate('/advanced')
  }

  // Balance calculations
  const balance = getBalance(activeAccount)
  const allTransferOptions = getTransferOptions(activeAccount)
  const poolBondOptions = allTransferOptions.pool
  const unlockingPools = poolBondOptions.totalUnlocking.plus(
    poolBondOptions.totalUnlocked
  )

  // Get account non-staking locks
  const { locks } = getLocks(activeAccount)
  const locksStaking = locks.find(({ id }) => id === 'staking')
  const lockStakingAmount = locksStaking
    ? locksStaking.amount
    : new BigNumber(0)

  // Calculate balances
  const { free } = balance
  const available = planckToUnitBn(
    BigNumber.max(free.minus(lockStakingAmount), 0),
    units
  )
  const totalBalance = planckToUnitBn(free.plus(unlockingPools), units)
  const stakedBalance = planckToUnitBn(lockStakingAmount, units)
  const unclaimedRewardsValue = new BigNumber(unclaimedRewards.total)
  const totalRewards = new BigNumber(0)

  return (
    <>
      <PageTitle title={t('easyMode.title')} />

      {/* Top row with heading + switch mode */}
      <PageRow>
        <PageHeading>
          <AccountHeader
            address={activeAccount || ''}
            onSwitchMode={handleSwitchToAdvanced}
          />
        </PageHeading>
      </PageRow>

      <PageRow>
        <StatRow>
          <CardWrapper>
            <OverviewCard>
              <CardContentHeader>
                <FontAwesomeIcon icon={faCoins} />
                <h3>{t('easyMode.currentBalance')}</h3>
              </CardContentHeader>

              <BalanceContainer>
                <div className="token-icon">
                  {brand.token && typeof brand.token === 'function' && (
                    <brand.token />
                  )}
                </div>
                <div className="balance-info">
                  <div className="main-balance">
                    <Odometer
                      value={minDecimalPlaces(totalBalance.toFormat(), 2)}
                      zeroDecimals={2}
                    />
                    <span style={{ whiteSpace: 'nowrap' }}>{unit}</span>
                    <span className="fiat-value">
                      <Value totalBalance={totalBalance} />
                    </span>
                  </div>
                </div>
              </BalanceContainer>

              <MetricsContainer>
                <div className="metric">
                  <div className="label">{t('easyMode.balance.available')}</div>
                  <div className="value">
                    {available.toFormat()} {unit}
                  </div>
                </div>
                <div className="metric">
                  <div className="label">{t('easyMode.balance.staked')}</div>
                  <div className="value">
                    {stakedBalance.toFormat()} {unit}
                  </div>
                </div>
              </MetricsContainer>
            </OverviewCard>
          </CardWrapper>

          {/* Staking Status Card */}
          <CardWrapper>
            <OverviewCard>
              <CardContentHeader>
                <FontAwesomeIcon icon={faChartLine} />
                <h3>{t('easyMode.stakingStatus')}</h3>
              </CardContentHeader>
              <StatusBadge $active={isNominating()}>
                <div />
                {isNominating()
                  ? t('easyMode.activeStaking')
                  : t('easyMode.notStakingStatus')}
              </StatusBadge>
              {!isNominating() && (
                <ButtonPrimary
                  text={t('easyMode.startStaking')}
                  onClick={() => navigate('/stake')}
                  style={{ marginTop: '1rem' }}
                />
              )}
            </OverviewCard>
          </CardWrapper>

          {/* Rewards Card */}
          <CardWrapper>
            <OverviewCard>
              <CardContentHeader>
                <FontAwesomeIcon icon={faCoins} />
                <h3>{t('easyMode.rewards')}</h3>
              </CardContentHeader>
              <MetricsContainer
                style={{ borderTop: 0, paddingTop: 0, marginTop: 0 }}
              >
                <div className="metric">
                  <div className="label">{t('easyMode.unclaimedRewards')}</div>
                  <div className="value">
                    {unclaimedRewardsValue.toFormat()} {unit}
                  </div>
                </div>
                <div className="metric">
                  <div className="label">{t('easyMode.totalRewards')}</div>
                  <div className="value">
                    {totalRewards.toFormat()} {unit}
                  </div>
                </div>
              </MetricsContainer>
            </OverviewCard>
          </CardWrapper>

          {/* Commission Card */}
          <CardWrapper>
            <OverviewCard>
              <CardContentHeader>
                <FontAwesomeIcon icon={faPercent} />
                <h3>Pool / Validator Commission</h3>
              </CardContentHeader>
              <div style={{ marginBottom: '0.75rem' }}>
                {/* Example: "Pool Health - Good" with bold/green "Good" */}
                Pool Health - <PoolHealth>Good</PoolHealth>
              </div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                This pool is charging 0% commission, you are earning optimum
                rewards
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-color-secondary)',
                }}
              >
                Advice if it is healthy or needs change (add logic)
              </div>
            </OverviewCard>
          </CardWrapper>
        </StatRow>
      </PageRow>

      {/* Recommendation box */}
      <PageRow>
        <CardWrapper>
          <OverviewCard>
            <CardContentHeader>
              <FontAwesomeIcon icon={faLightbulb} />
              <h3>{t('easyMode.recommendation')}</h3>
            </CardContentHeader>
            <div
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-color-secondary)',
              }}
            >
              Based on your current balance and staking preferences, we'll
              provide personalized recommendations here.
            </div>
          </OverviewCard>
        </CardWrapper>
      </PageRow>

      {/* Actions + warning */}
      <PageRow>
        <CardWrapper>
          <OverviewCard>
            <ActionsRow>
              <ButtonPrimary
                onClick={() => navigate('/stake')}
                text={t('easyMode.stake')}
                disabled={!activeAccount}
              />
              <ButtonPrimary
                onClick={() => navigate('/unstake')}
                text={t('easyMode.unstake')}
                disabled={!activeAccount || !isNominating()}
              />
              <ButtonPrimary
                onClick={() => navigate('/rewards')}
                text={t('easyMode.claimRewards')}
                disabled={!activeAccount || unclaimedRewardsValue.isZero()}
              />
            </ActionsRow>
            <WarningBox>
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <div>{t('easyMode.warning')}</div>
            </WarningBox>
          </OverviewCard>
        </CardWrapper>
      </PageRow>
    </>
  )
}

export default EasyMode
