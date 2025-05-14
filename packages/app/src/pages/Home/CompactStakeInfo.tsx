// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { planckToUnit } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { usePayouts } from 'contexts/Payouts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useSyncing } from 'hooks/useSyncing'
import { Balance } from 'library/Balance'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { ButtonSecondary } from 'ui-buttons'
import { CardHeader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { CompactStakeInfoWrapper, StakeInfoValueWrapper } from './Wrappers'

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

// Compact Staking Information Component for Easy Mode
export const CompactStakeInfo = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { unit, units } = getNetworkData(network)
  const { currency } = useCurrency()
  const { openModal } = useOverlay().modal
  const { getStakedBalance } = useTransferOptions()
  const { getPendingPoolRewards } = useBalances()
  const { unclaimedRewards } = usePayouts()
  const { activeAddress } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { inPool, activePool, activePoolNominations } = useActivePool()
  const { poolsMetaData } = useBondedPools()
  const { getNominationStatus } = useNominationStatus()
  const { syncing } = useSyncing(['active-pools'])
  const Token = getChainIcons(network).token

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

  return (
    <CompactStakeInfoWrapper>
      <CardHeader>
        <h4>{isStakingViaPool ? t('poolStaking') : t('directStaking')}</h4>
        {isStakingViaPool && (
          <HeaderActions>
            <Balance.WithFiat
              Token={<Token />}
              value={stakedBalance.toNumber()}
              currency={currency}
            />
          </HeaderActions>
        )}
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

        {/* Pool Status (only for pool staking) */}
        {isStakingViaPool && (
          <div className="stake-info-row">
            <div className="stake-info-label">{t('status')}</div>
            <StakeInfoValueWrapper>
              <span className="status">{`${poolStatusLeft}${poolStatusRight}`}</span>
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

        {/* Only show this row for direct nomination since pool staking shows balance in header */}
        {isDirectNomination && (
          <div className="stake-info-row">
            <div className="stake-info-label">{t('bondedFunds')}</div>
            <StakeInfoValueWrapper>
              <span className="value">{stakedBalance.toFormat()}</span>
              <span className="unit">{unit}</span>
            </StakeInfoValueWrapper>
          </div>
        )}

        <div className="stake-info-row">
          <div className="stake-info-label">{t('unclaimedRewards')}</div>
          <StakeInfoValueWrapper>
            <span className="value">{formattedPendingRewards}</span>
            <span className="unit">{unit}</span>
          </StakeInfoValueWrapper>
        </div>

        {/* Manage Pool button */}
        {isStakingViaPool && poolId !== undefined && (
          <div className="stake-info-manage">
            <ButtonSecondary
              text={t('manage')}
              onClick={() =>
                openModal({
                  key: 'ManagePool',
                  options: { disableWindowResize: true, disableScroll: true },
                  size: 'sm',
                })
              }
              iconRight={faChevronRight}
              style={{ marginTop: '0.75rem' }}
            />
          </div>
        )}
      </div>
    </CompactStakeInfoWrapper>
  )
}
