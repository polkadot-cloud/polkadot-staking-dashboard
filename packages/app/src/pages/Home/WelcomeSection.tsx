// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { planckToUnit } from '@w3ux/utils'
import HandWaveIcon from 'assets/icons/hand.svg?react'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import {
  fetchNominatorRewardTrend,
  fetchPoolRewardTrend,
} from 'plugin-staking-api'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useActiveAccounts } from '../../contexts/ActiveAccounts'
import { useApi } from '../../contexts/Api'
import { useBalances } from '../../contexts/Balances'
import { useImportedAccounts } from '../../contexts/Connect/ImportedAccounts'
import { useNetwork } from '../../contexts/Network'
import { useActivePool } from '../../contexts/Pools/ActivePool'
import { useStaking } from '../../contexts/Staking'
import { useErasPerDay } from '../../hooks/useErasPerDay'
import { ButtonCopy } from '../../library/ButtonCopy'
import { WelcomeWrapper } from './Wrappers'

export const WelcomeSection = () => {
  const { t } = useTranslation('pages')
  const { activeAddress } = useActiveAccounts()
  const { getAccount } = useImportedAccounts()
  const { network } = useNetwork()
  const { activeEra } = useApi()
  const { isNominator } = useStaking()
  const { inPool } = useActivePool()
  const { getStakingLedger } = useBalances()
  const { erasPerDay } = useErasPerDay()

  // State to store 30-day reward amount
  const [rewardAmount, setRewardAmount] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(false)

  // Get network data for unit conversion
  const { unit, units } = getStakingChainData(network)

  // Get account details if available
  const accountData = activeAddress ? getAccount(activeAddress) : null
  const accountName = accountData?.name || null

  // Check if user is actively staking (nominating or in pool)
  const isActivelyStaking = isNominator || inPool

  // Fetch 30-day rewards if user is actively staking
  useEffect(() => {
    const fetchRewardData = async () => {
      if (activeAddress && activeEra.index > 0 && isActivelyStaking) {
        setIsLoading(true)

        try {
          const { poolMembership } = getStakingLedger(activeAddress)
          const eras = erasPerDay * 30
          // 30 day duration in seconds
          const duration = 2592000

          const result = poolMembership
            ? await fetchPoolRewardTrend(network, activeAddress, duration)
            : await fetchNominatorRewardTrend(network, activeAddress, eras)

          if (result) {
            // Convert planck to readable units
            const formattedValue = new BigNumber(
              planckToUnit(result.reward, units)
            )
              .decimalPlaces(3)
              .toFormat()

            setRewardAmount(formattedValue)
          }
        } catch (error) {
          console.error('Error fetching reward data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchRewardData()
  }, [activeAddress, network, activeEra.index, isActivelyStaking])

  // If user has an active account, show personalized welcome
  if (activeAddress) {
    return (
      <WelcomeWrapper>
        <div className="welcome-header">
          <HandWaveIcon className="wave-icon" aria-hidden="true" />
          <h2>{t('welcomeBack')}</h2>
        </div>
        <div className="welcome-content">
          <div className="account-info">
            <span>{accountName || t('activeAccount')}:</span>
            <div className="account-address-container">
              <span className="account-address">{activeAddress}</span>
              <ButtonCopy value={activeAddress} size="0.95rem" xMargin />
            </div>
          </div>
          <div className="welcome-content-text">
            <p className="welcome-message">{t('welcomeMessage')}</p>

            {/* Show 30-day reward if user is actively staking */}
            {isActivelyStaking && !isLoading && (
              <p className="reward-info">
                {t('inTheLast30Days', {
                  defaultValue: 'In the last 30 days you have earned',
                })}{' '}
                <strong>
                  {rewardAmount} {unit}
                </strong>
              </p>
            )}
          </div>
        </div>
      </WelcomeWrapper>
    )
  }

  // If no active account, show general welcome with features list
  return (
    <WelcomeWrapper>
      <div className="welcome-header">
        <HandWaveIcon className="wave-icon" aria-hidden="true" />
        <h2>{t('welcomeToStakingDashboard')}</h2>
      </div>
      <div className="welcome-content">
        <p className="welcome-message">{t('dashboardIntro')}</p>

        <div className="features-list">
          <h3>{t('whatYouCanDo')}</h3>
          <ul>
            <li>{t('featureStake')}</li>
            <li>{t('featureMonitor')}</li>
            <li>{t('featureManage')}</li>
            <li>{t('featureRewards')}</li>
          </ul>
        </div>

        <div className="connect-prompt">
          <FontAwesomeIcon
            icon={faWallet}
            className="wallet-icon"
            aria-hidden="true"
          />
          <p>{t('connectWalletPrompt')}</p>
        </div>
      </div>
    </WelcomeWrapper>
  )
}
