// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util/chains'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useFastUnstake } from 'contexts/FastUnstake'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useTranslation } from 'react-i18next'
import { useNominationStatus } from '../useNominationStatus'

export const useUnstaking = () => {
  const { t } = useTranslation('app')
  const { network } = useNetwork()
  const { isNominator } = useStaking()
  const { activeAddress } = useActiveAccounts()
  const {
    stakingMetrics: { minNominatorBond, minimumActiveStake },
  } = useApi()
  const { getNominationStatus } = useNominationStatus()
  const { head, queueDeposit, fastUnstakeStatus, exposed } = useFastUnstake()
  const {
    balances: {
      nominator: { active },
    },
  } = useAccountBalances(activeAddress)
  const { ss58 } = getStakingChainData(network)
  const { nominees } = getNominationStatus(activeAddress, 'nominator')

  // Calculate if this is a legacy nominator
  const minToEarnRewards = BigNumber.max(minNominatorBond, minimumActiveStake)
  const isLegacyNominator =
    active > 0n &&
    new BigNumber(active.toString()).isLessThan(
      new BigNumber(minToEarnRewards.toString())
    )

  // Determine if user is fast unstaking
  const inHead =
    head?.stashes.find((s) => s[0].address(ss58) === activeAddress) ?? undefined
  const inQueue = queueDeposit?.queue !== undefined && queueDeposit.queue > 0n

  const registered = inHead || inQueue

  // Determine unstake button text
  const getFastUnstakeText = () => {
    // Special handling for legacy nominators
    if (isLegacyNominator && fastUnstakeStatus?.status === 'EXPOSED') {
      return t('fastUnstake') // Show as available
    }
    if (exposed && fastUnstakeStatus?.lastExposed) {
      return t('fastUnstakeExposed', {
        count: Number(fastUnstakeStatus.lastExposed),
      })
    }
    if (registered) {
      return t('inQueue')
    }
    return t('fastUnstake')
  }

  return {
    getFastUnstakeText,
    isUnstaking: isNominator && !nominees.active.length && active === 0n,
    isFastUnstaking: !!registered,
    isLegacyNominator, // Export this for other components
  }
}
