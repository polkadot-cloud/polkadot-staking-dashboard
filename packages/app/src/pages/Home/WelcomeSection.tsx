// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HandWaveIcon from 'assets/icons/hand.svg?react'
import { useTranslation } from 'react-i18next'
import { useActiveAccounts } from '../../contexts/ActiveAccounts'
import { useImportedAccounts } from '../../contexts/Connect/ImportedAccounts'
import { ButtonCopy } from '../../library/ButtonCopy'
import { WelcomeWrapper } from './Wrappers'

export const WelcomeSection = () => {
  const { t } = useTranslation('pages')
  const { activeAddress } = useActiveAccounts()
  const { getAccount } = useImportedAccounts()

  // Get account details if available
  const accountData = activeAddress ? getAccount(activeAddress) : null
  const accountName = accountData?.name || null

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
          <p className="welcome-message">{t('welcomeMessage')}</p>
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
