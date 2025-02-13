// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
import { CardLabel, PageHeading, PageRow, PageTitle } from 'ui-core/base'
import { planckToUnitBn } from 'utils'
import { Value } from '../Overview/AccountBalance/Value'
import EasyAccountControls from './EasyAccountControls'
import {
  ActionsRow,
  CardGrid,
  OverviewCard,
  SectionHeader,
  WarningBox,
} from './Wrappers'

export const EasyMode = () => {
  const { t } = useTranslation('pages')
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('stakingMode', 'easy')
  }, [])

  const handleSwitchToAdvanced = () => {
    localStorage.setItem('stakingMode', 'advanced')
    navigate('/advanced')
  }

  const {
    networkData: { units, unit, brand },
  } = useNetwork()
  const { getBalance, getLocks } = useBalances()
  const { activeAccount } = useActiveAccounts()
  const balance = getBalance(activeAccount)

  const { getTransferOptions } = useTransferOptions()
  const allTransferOptions = getTransferOptions(activeAccount)
  const poolOptions = allTransferOptions.pool
  const unlockingPools = poolOptions.totalUnlocking.plus(
    poolOptions.totalUnlocked
  )

  const totalBalance: BigNumber = planckToUnitBn(
    balance.free.plus(poolOptions.active).plus(unlockingPools),
    units
  )

  const inPool = planckToUnitBn(
    poolOptions.active
      .plus(poolOptions.totalUnlocking)
      .plus(poolOptions.totalUnlocked),
    units
  )

  const { locks } = getLocks(activeAccount)
  const locksStaking = locks.find(({ id }) => id === 'staking')
  const lockStakingAmount = locksStaking
    ? locksStaking.amount
    : new BigNumber(0)
  const available = planckToUnitBn(
    BigNumber.max(balance.free.minus(lockStakingAmount), 0),
    units
  )
  const notStaking = available

  const { isNominating } = useStaking()
  const { unclaimedRewards } = usePayouts()
  const unclaimedRewardsValue = new BigNumber(unclaimedRewards.total)
  const totalRewards = new BigNumber(0) // Default if not otherwise provided

  const handleStake = () => {
    console.log('Stake action invoked')
  }
  const handleUnstake = () => {
    console.log('Unstake action invoked')
  }
  const handleClaimRewards = () => {
    console.log('Claim Rewards action invoked')
  }

  return (
    <>
      <PageTitle title={t('easyMode.title', 'Easy Mode Staking Overview')} />

      <PageRow>
        <PageHeading>
          <EasyAccountControls />
        </PageHeading>
      </PageRow>

      <PageRow style={{ justifyContent: 'flex-end' }}>
        <ButtonPrimary
          onClick={handleSwitchToAdvanced}
          text={t('easyMode.switchToAdvanced', 'Switch to Advanced Mode')}
        />
      </PageRow>

      <CardGrid>
        <CardWrapper>
          <OverviewCard>
            <SectionHeader>
              {t('easyMode.currentBalance', 'Current Balance')}
            </SectionHeader>
            <h2 style={{ display: 'flex', alignItems: 'center' }}>
              {brand.token && typeof brand.token === 'function' ? (
                <brand.token title="token" />
              ) : (
                brand.token
              )}
              <Odometer
                value={minDecimalPlaces(totalBalance.toFormat(), 2)}
                zeroDecimals={2}
              />
              <CardLabel>
                <Value totalBalance={totalBalance} />
              </CardLabel>
            </h2>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              <strong>{t('easyMode.inPool', 'In a Pool')}: </strong>
              {inPool.toFormat()} {unit} ·{' '}
              <strong>{t('easyMode.notStaking', 'Not Staking')}: </strong>
              {notStaking.toFormat()} {unit}
            </p>
          </OverviewCard>
        </CardWrapper>

        <CardWrapper>
          <OverviewCard>
            <SectionHeader>
              {t('easyMode.stakingStatus', 'Staking Status')}
            </SectionHeader>
            <p>
              {isNominating()
                ? t(
                    'easyMode.activeStaking',
                    'You are actively nominating validators.'
                  )
                : t(
                    'easyMode.notStakingStatus',
                    'You are currently not staking.'
                  )}
            </p>
          </OverviewCard>
        </CardWrapper>

        <CardWrapper>
          <OverviewCard>
            <SectionHeader>
              {t('easyMode.unclaimedRewards', 'Unclaimed Rewards')}
            </SectionHeader>
            <p style={{ marginBottom: '0.5rem' }}>
              {unclaimedRewardsValue.toFormat()} {unit}
            </p>
            <SectionHeader>
              {t('easyMode.totalRewards', 'Total Rewards All Time')}
            </SectionHeader>
            <p>
              {totalRewards.toFormat()} {unit}
            </p>
          </OverviewCard>
        </CardWrapper>
      </CardGrid>

      <PageRow>
        <CardWrapper>
          <OverviewCard>
            <ActionsRow>
              <ButtonPrimary
                onClick={handleStake}
                text={t('easyMode.stake', 'Stake')}
              />
              <ButtonPrimary
                onClick={handleUnstake}
                text={t('easyMode.unstake', 'Unstake')}
              />
              <ButtonPrimary
                onClick={handleClaimRewards}
                text={t('easyMode.claimRewards', 'Claim Rewards')}
              />
            </ActionsRow>
            <WarningBox>
              {t(
                'easyMode.warning',
                'Note: Unstaking initiates a 28-day lock period before funds become available. Rewards may be subject to protocol rules or delays.'
              )}
            </WarningBox>
          </OverviewCard>
        </CardWrapper>
      </PageRow>
    </>
  )
}

export default EasyMode
