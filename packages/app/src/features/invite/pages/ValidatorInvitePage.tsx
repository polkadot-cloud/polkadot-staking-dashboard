// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CardWrapper } from 'library/Card/Wrappers'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { ButtonPrimary } from 'ui-buttons'
import { Page, Stat } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { extractValidatorsFromUrl } from '../utils/inviteHelpers'
import { AverageCommission } from './Stats/AverageCommission'
import { SelectedValidators } from './Stats/SelectedValidators'
import { ValidatorsToNominate } from './Stats/ValidatorsToNominate'
import {
  ActionButtonsWrapper,
  ErrorState,
  LoadingState,
  ValidatorListContainer,
  Wrapper,
} from './Wrappers'

export const ValidatorInvitePage = () => {
  const { t } = useTranslation('invite')
  const { activeAccount } = useActiveAccounts()
  const { isReady } = useApi()
  const { modal } = useOverlay()
  const { pathname, hash } = useLocation()
  const {
    formatWithPrefs,
    validatorIdentities,
    validatorSupers,
    getValidatorTotalStake,
  } = useValidators()

  // Extract validators from URL - include the full URL (pathname + hash)
  const fullUrl = `${pathname}${hash}`
  const urlValidators = extractValidatorsFromUrl(fullUrl)

  // Store selected validators - initially all validators from URL are selected
  const [selectedValidators, setSelectedValidators] = useState<string[]>([])

  // Track if initial selection has been set
  const initialSelectionSet = useRef(false)

  // Store error state
  const [error, setError] = useState<string | null>(null)

  // Check if validators exist and are valid
  useEffect(() => {
    if (!isReady || initialSelectionSet.current) {
      return
    }

    // If no validators were extracted, show error
    if (!urlValidators.length) {
      setError(t('noValidatorsInUrl'))
      return
    }

    // Skip validation of validators against the network list
    // This is because the validators in the URL might be valid but not yet
    // loaded in the validators list or might be from a different network
    setSelectedValidators(urlValidators)
    initialSelectionSet.current = true
  }, [isReady, urlValidators, t])

  // Toggle validator selection
  const toggleValidator = (address: string) => {
    setSelectedValidators((current) => {
      // Check if the validator is already selected
      const isSelected = current.includes(address)

      // If selected, remove it; otherwise, add it
      if (isSelected) {
        return current.filter((a) => a !== address)
      } else {
        return [...current, address]
      }
    })
  }

  // Handle card click with explicit event handler
  const handleCardClick = (e: React.MouseEvent, address: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleValidator(address)
  }

  // Handle nominate action
  const handleNominate = () => {
    if (!activeAccount) {
      modal.openModal({
        key: 'Connect',
        options: { forceConnection: true },
      })
      return
    }

    if (selectedValidators.length === 0) {
      return
    }

    modal.openModal({
      key: 'NominateValidators',
      options: {
        nominations: selectedValidators,
        bondFor: 'nominator',
      },
    })
  }

  // Format DOT amount with commas
  const formatDOTAmount = (amount: bigint) => {
    // Convert to DOT (10^10 planck = 1 DOT)
    const dotAmount = Number(amount) / 10000000000

    // Format with commas
    return dotAmount.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })
  }

  // Format commission directly without using perbillToPercent
  // Based on the raw values in the logs (5, 3, etc.), these appear to be
  // percentages directly, not parts per billion
  const formatCommissionDirectly = (commission: number | undefined): string => {
    if (commission === undefined || commission === null) {
      return '0.00'
    }

    // Handle edge cases to prevent NaN
    if (isNaN(commission)) {
      return '0.00'
    }

    // The raw values appear to already be in percentage format
    // Just format to 2 decimal places
    return commission.toFixed(2)
  }

  // If not ready, show loading state
  if (!isReady) {
    return (
      <Wrapper>
        <Page.Title title={t('validatorInvite')} />
        <LoadingState>
          <h3>{t('connecting')}</h3>
        </LoadingState>
      </Wrapper>
    )
  }

  // If error, show error state
  if (error) {
    return (
      <Wrapper>
        <Page.Title title={t('validatorInvite')} />
        <ErrorState>
          <h3>{error}</h3>
        </ErrorState>
      </Wrapper>
    )
  }

  // Get valid validators from URL
  const validValidators = formatWithPrefs(urlValidators)

  return (
    <Wrapper>
      <Page.Title title={t('validatorInvite')} />

      <Page.Row>
        <CardWrapper>
          <Stat.Row>
            <ValidatorsToNominate count={validValidators.length} />
            <SelectedValidators count={selectedValidators.length} />
            <AverageCommission
              validators={validValidators.filter((v) =>
                selectedValidators.includes(v.address)
              )}
            />
          </Stat.Row>

          <ValidatorListContainer>
            <div className="validator-grid">
              {validValidators.map(({ address, prefs }) => {
                const isSelected = selectedValidators.includes(address)
                const identity = validatorIdentities[address] || null
                const superIdentity = validatorSupers[address] || null
                const identityDisplay = getIdentityDisplay(
                  identity,
                  superIdentity
                )

                // Get validator's total stake
                const totalStake = getValidatorTotalStake(address)
                const formattedStake = formatDOTAmount(totalStake)

                // Get commission directly from prefs
                const commissionValue = prefs?.commission ?? 0
                // Format commission directly without using perbillToPercent
                const commissionPercent =
                  formatCommissionDirectly(commissionValue)

                return (
                  <div
                    key={address}
                    className={`validator-item ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => handleCardClick(e, address)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleValidator(address)
                      }
                    }}
                    data-testid={`validator-card-${address}`}
                  >
                    <div className="validator-header">
                      <div className="identity">
                        <Polkicon address={address} />
                        <span className="name">
                          {identityDisplay.node || ellipsisFn(address)}
                        </span>
                      </div>
                      <div className="validator-info">
                        <span className="commission-value">
                          Commission: {commissionPercent}%
                        </span>
                        <div className="status-info">
                          <span className="status active">Active</span>
                          <span className="dot-amount">
                            {formattedStake} DOT
                          </span>
                        </div>
                      </div>
                      <div className="actions">
                        <CopyAddress address={address} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ValidatorListContainer>

          <ActionButtonsWrapper
            style={{ marginTop: '2rem', marginBottom: '1rem' }}
          >
            <ButtonPrimary
              iconRight={faChevronCircleRight}
              disabled={selectedValidators.length === 0}
              onClick={handleNominate}
              text={t('nominateValidators')}
            />
          </ActionButtonsWrapper>
        </CardWrapper>
      </Page.Row>
    </Wrapper>
  )
}
