// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronRight,
  faCog,
  faStopCircle,
} from '@fortawesome/free-solid-svg-icons'
import { planckToUnit } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { usePayouts } from 'contexts/Payouts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { useSyncing } from 'hooks/useSyncing'
import { useUnstaking } from 'hooks/useUnstaking'
import { Balance } from 'library/Balance'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { ButtonTertiary } from 'ui-buttons'
import { ButtonRow, CardHeader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import {
  CompactStakeInfoWrapper,
  StakeInfoLabel,
  StakeInfoValueWrapper,
} from './Wrappers'

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

// Compact Staking Information Component for Easy Mode
export const CompactStakeInfo = () => {
  const { t } = useTranslation('pages')
  const { t: tApp } = useTranslation('app')
  const { network } = useNetwork()
  const { unit, units } = getStakingChainData(network)
  const { currency } = useCurrency()
  const { openModal } = useOverlay().modal
  const { openCanvas } = useOverlay().canvas
  const { getStakedBalance } = useTransferOptions()
  const { getPendingPoolRewards, getStakingLedger, getNominations } =
    useBalances()
  const { unclaimedRewards } = usePayouts()
  const { activeAddress } = useActiveAccounts()
  const { isNominator } = useStaking()
  const { isFastUnstaking } = useUnstaking()
  const { inPool, activePool, activePoolNominations } = useActivePool()
  const { poolsMetaData } = useBondedPools()
  const { getNominationStatus } = useNominationStatus()
  const { syncing } = useSyncing(['active-pools'])
  const { getPayeeItems } = usePayeeConfig()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { formatWithPrefs } = useValidators()
  const Token = getChainIcons(network).token

  // Determine if user is staking via pool or direct nomination
  const isStakingViaPool = inPool
  const isDirectNomination = isNominator && !isStakingViaPool
  const isStaking = isStakingViaPool || isDirectNomination

  if (!isStaking) {
    return null
  }

  // Get bonded funds balance
  const stakedBalance = getStakedBalance(activeAddress)

  // Get pending rewards
  let pendingRewards = new BigNumber(0)
  let formattedPendingRewards = '0'

  if (isStakingViaPool) {
    // For pool stakers
    const pendingRewardsRaw = getPendingPoolRewards(activeAddress)
    // Convert from planck to unit with proper decimal places
    const pendingRewardsInUnit = planckToUnit(
      pendingRewardsRaw.toString(),
      units
    )
    pendingRewards = new BigNumber(pendingRewardsInUnit)

    // Format with appropriate decimal places
    if (pendingRewards.isZero()) {
      formattedPendingRewards = '0'
    } else if (pendingRewards.lt(0.0001)) {
      // For very small values, show up to 8 decimal places
      formattedPendingRewards = pendingRewards.toFormat(8)
    } else {
      formattedPendingRewards = pendingRewards.toFormat()
    }
  } else if (isDirectNomination) {
    // For direct nominators - use the unclaimed rewards from the Payouts context
    // First convert from planck to unit
    const pendingRewardsInUnit = planckToUnit(unclaimedRewards.total, units)
    pendingRewards = new BigNumber(pendingRewardsInUnit)

    // Format based on value size
    if (pendingRewards.isZero()) {
      formattedPendingRewards = '0'
    } else if (pendingRewards.lt(1)) {
      // For values less than 1, display with proper decimal places
      formattedPendingRewards = pendingRewards.toFormat()
    } else {
      formattedPendingRewards = pendingRewards.toFormat()
    }
  }

  // Get nomination status for direct nominators
  const nominationStatus = isDirectNomination
    ? getNominationStatus(activeAddress, 'nominator')
    : null

  // Get pool metadata
  const poolId = activePool?.id
  const poolName =
    poolId !== undefined ? poolsMetaData[poolId] || t('unnamedPool') : ''

  // Get pool status
  const poolStash = activePool?.addresses?.stash || ''
  const { earningRewards, nominees } = getNominationStatus(poolStash, 'pool')
  const poolState = activePool?.bondedPool?.state ?? null
  const poolNominating = !!activePoolNominations?.targets?.length

  // Determine pool status display
  const poolStatusLeft =
    poolState === 'Blocked'
      ? `${t('locked')} / `
      : poolState === 'Destroying'
        ? `${t('destroying')} / `
        : ''

  const poolStatusRight = syncing
    ? t('inactivePoolNotNominating')
    : !poolNominating
      ? t('inactivePoolNotNominating')
      : nominees.active.length
        ? `${t('nominatingAnd')} ${
            earningRewards ? t('earningRewards') : t('notEarningRewards')
          }`
        : t('waitingForActiveNominations')

  // Get payout destination for direct nominators
  const payee = getStakingLedger(activeAddress).payee

  // Get payee status text to display for direct nominators
  const getPayeeStatus = () => {
    if (isNominator) {
      return t('notAssigned')
    }
    const status = getPayeeItems(true).find(
      ({ value }) => value === payee?.destination
    )?.activeTitle

    if (status) {
      return status
    }
    return t('notAssigned')
  }

  // Get nominations for direct nominators
  const nominated = isDirectNomination
    ? formatWithPrefs(getNominations(activeAddress))
    : []

  // Check if the user has active nominations
  const hasNominations = nominated.length > 0

  // Determine whether buttons are disabled.
  const btnsDisabled =
    (isDirectNomination && syncing) ||
    (isDirectNomination && !isNominator) ||
    isReadOnlyAccount(activeAddress) ||
    isFastUnstaking

  return (
    <CompactStakeInfoWrapper>
      <CardHeader>
        <h4>{isStakingViaPool ? t('poolStaking') : t('directStaking')}</h4>
        {/* Show balance in header similar to pools for direct nominations also */}
        <HeaderActions>
          <Balance.WithFiat
            Token={<Token />}
            value={stakedBalance.toNumber()}
            currency={currency}
          />
        </HeaderActions>
      </CardHeader>

      <div className="stake-info-content">
        {/* Pool ID and Name (only for pool staking) */}
        {isStakingViaPool && poolId !== undefined && (
          <div className="stake-info-row">
            <StakeInfoLabel>{t('pool')}</StakeInfoLabel>
            <StakeInfoValueWrapper>
              <div className="pool-text">
                <span className="value">#{poolId}</span>
                <span className="unit">{poolName}</span>
              </div>
            </StakeInfoValueWrapper>
          </div>
        )}

        {/* Pool Status (only for pool staking) */}
        {isStakingViaPool && (
          <div className="stake-info-row">
            <StakeInfoLabel>{t('status')}</StakeInfoLabel>
            <StakeInfoValueWrapper>
              <div className="pool-status-text">
                <span className="status">{`${poolStatusLeft}${poolStatusRight}`}</span>
              </div>
            </StakeInfoValueWrapper>
          </div>
        )}

        {/* Nominator Status (only for direct nomination) */}
        {isDirectNomination && nominationStatus && (
          <div className="stake-info-row">
            <StakeInfoLabel>{t('status')}</StakeInfoLabel>
            <StakeInfoValueWrapper>
              <span className="status">{nominationStatus.message}</span>
            </StakeInfoValueWrapper>
          </div>
        )}

        {/* Nominators Count (only for direct nomination) */}
        {isDirectNomination && (
          <div className="stake-info-row">
            <StakeInfoLabel>{tApp('validators')}</StakeInfoLabel>
            <StakeInfoValueWrapper>
              <div className="validator-text">
                <span className="status">
                  {hasNominations
                    ? t('validatorCount', { count: nominated.length })
                    : t('noNominationsSet')}
                </span>
              </div>
              {hasNominations && (
                <div className="validator-buttons">
                  <ButtonRow>
                    <ButtonTertiary
                      text={t('manage')}
                      iconRight={faCog}
                      disabled={btnsDisabled}
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
                    <ButtonTertiary
                      text={t('stop')}
                      iconRight={faStopCircle}
                      disabled={btnsDisabled}
                      onClick={() =>
                        openModal({
                          key: 'StopNominations',
                          options: {
                            nominations: [],
                            bondFor: 'nominator',
                          },
                          size: 'sm',
                        })
                      }
                    />
                  </ButtonRow>
                </div>
              )}
            </StakeInfoValueWrapper>
          </div>
        )}

        {/* Payout Destination (only for direct nomination) */}
        {isDirectNomination && (
          <div className="stake-info-row">
            <StakeInfoLabel>{t('payoutDestination')}</StakeInfoLabel>
            <StakeInfoValueWrapper>
              <div className="payee-text">
                <span className="status">{getPayeeStatus()}</span>
              </div>
              <div className="payee-buttons">
                <ButtonRow>
                  <ButtonTertiary
                    text={t('update')}
                    iconRight={faCog}
                    disabled={btnsDisabled}
                    onClick={() =>
                      openModal({ key: 'UpdatePayee', size: 'sm' })
                    }
                  />
                </ButtonRow>
              </div>
            </StakeInfoValueWrapper>
          </div>
        )}

        {/* Unclaimed Rewards */}
        <div className="stake-info-row">
          <StakeInfoLabel>
            {isDirectNomination ? t('pendingPayouts') : t('unclaimedRewards')}
          </StakeInfoLabel>
          <StakeInfoValueWrapper>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="value">{formattedPendingRewards}</span>
              <span className="unit">{unit}</span>
            </div>
          </StakeInfoValueWrapper>
        </div>

        {/* Manage Pool button */}
        {isStakingViaPool && poolId !== undefined && (
          <div className="stake-info-row">
            <StakeInfoLabel>{t('manage')}</StakeInfoLabel>
            <StakeInfoValueWrapper>
              <div className="pool-buttons">
                <ButtonRow>
                  <ButtonTertiary
                    text={t('manage')}
                    iconRight={faChevronRight}
                    onClick={() =>
                      openModal({
                        key: 'ManagePool',
                        options: {
                          disableWindowResize: true,
                          disableScroll: true,
                        },
                        size: 'sm',
                      })
                    }
                  />
                </ButtonRow>
              </div>
            </StakeInfoValueWrapper>
          </div>
        )}
      </div>
    </CompactStakeInfoWrapper>
  )
}
