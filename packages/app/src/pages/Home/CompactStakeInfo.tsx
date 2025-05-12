// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { usePayouts } from 'contexts/Payouts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useTranslation } from 'react-i18next'
import { CardHeader } from 'ui-core/base'
import { CompactStakeInfoWrapper, StakeInfoValueWrapper } from './Wrappers'

// Compact Staking Information Component for Easy Mode
export const CompactStakeInfo = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { unit, units } = getNetworkData(network)
  const { getStakedBalance } = useTransferOptions()
  const { getPendingPoolRewards } = useBalances()
  const { unclaimedRewards } = usePayouts()
  const { activeAddress } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { inPool, activePool } = useActivePool()
  const { poolsMetaData } = useBondedPools()
  const { getNominationStatus } = useNominationStatus()

  // Determine if user is staking via pool or direct nomination
  const isStakingViaPool = inPool()
  const isDirectNomination = !inSetup() && !isStakingViaPool
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
    pendingRewards = new BigNumber(unclaimedRewards.total)
    formattedPendingRewards = pendingRewards.toFormat()
  }

  // Get nomination status for direct nominators
  const nominationStatus = isDirectNomination
    ? getNominationStatus(activeAddress, 'nominator')
    : null

  // Get pool metadata
  const poolId = activePool?.id
  const poolName =
    poolId !== undefined ? poolsMetaData[poolId] || t('unnamedPool') : ''

  return (
    <CompactStakeInfoWrapper>
      <CardHeader>
        <h4>{isStakingViaPool ? t('poolStaking') : t('directStaking')}</h4>
      </CardHeader>

      <div className="stake-info-content">
        {/* Pool ID and Name (only for pool staking) */}
        {isStakingViaPool && poolId !== undefined && (
          <div className="stake-info-row">
            <div className="stake-info-label">{t('pool')}</div>
            <StakeInfoValueWrapper>
              <span className="value">#{poolId}</span>
              <span className="unit">{poolName}</span>
            </StakeInfoValueWrapper>
          </div>
        )}

        {/* Nominator Status (only for direct nomination) */}
        {isDirectNomination && nominationStatus && (
          <div className="stake-info-row">
            <div className="stake-info-label">{t('status')}</div>
            <StakeInfoValueWrapper>
              <span className="status">{nominationStatus.message}</span>
            </StakeInfoValueWrapper>
          </div>
        )}

        <div className="stake-info-row">
          <div className="stake-info-label">{t('bondedFunds')}</div>
          <StakeInfoValueWrapper>
            <span className="value">{stakedBalance.toFormat()}</span>
            <span className="unit">{unit}</span>
          </StakeInfoValueWrapper>
        </div>

        <div className="stake-info-row">
          <div className="stake-info-label">{t('unclaimedRewards')}</div>
          <StakeInfoValueWrapper>
            <span className="value">{formattedPendingRewards}</span>
            <span className="unit">{unit}</span>
          </StakeInfoValueWrapper>
        </div>
      </div>
    </CompactStakeInfoWrapper>
  )
}
