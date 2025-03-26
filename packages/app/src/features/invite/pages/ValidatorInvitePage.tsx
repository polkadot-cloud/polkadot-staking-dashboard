// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useTooltip } from 'contexts/Tooltip'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CardWrapper } from 'library/Card/Wrappers'
import { CurrentEraPoints } from 'library/List/EraPointsGraph/CurrentEraPoints'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { ButtonPrimary } from 'ui-buttons'
import { Page, TooltipArea } from 'ui-core/base'
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
  WarningMessage,
  Wrapper,
} from './Wrappers'

export const ValidatorInvitePageInner = () => {
  const { t } = useTranslation('invite')
  const { isReady } = useApi()
  const { getNominations } = useBalances()
  const validatorsContext = useValidators()
  const { openModal } = useOverlay().modal
  const { activeAccount } = useActiveAccounts()
  const location = useLocation()
  const { setTooltipTextAndOpen } = useTooltip()

  // State
  const [validatorAddresses, setValidatorAddresses] = useState<string[] | null>(
    null
  )
  const [selectedValidators, setSelectedValidators] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Extract validator addresses from URL on component mount
  useEffect(() => {
    // Use the full URL path including hash for extraction
    const fullUrl = window.location.href
    console.log('Full URL:', fullUrl)
    const addresses = extractValidatorsFromUrl(fullUrl)
    console.log('Extracted addresses:', addresses)
    setValidatorAddresses(addresses)

    // Pre-select all validators by default
    setSelectedValidators(addresses)
    setIsLoading(false)
  }, [location.hash])

  // Get validator details for the addresses
  const { getValidators } = validatorsContext
  const allValidators = getValidators()
  const filteredValidators = allValidators.filter(
    (validator) =>
      Array.isArray(validatorAddresses) &&
      validatorAddresses.includes(validator.address)
  )

  // Handle nominate button click
  const handleNominate = () => {
    if (!activeAccount) {
      openModal({
        key: 'Connect',
        options: { forceConnection: true },
      })
      return
    }

    if (selectedValidators.length === 0) {
      return
    }

    setIsSubmitting(true)
    openModal({
      key: 'NominateValidators',
      options: {
        nominations: selectedValidators,
        bondFor: 'nominator',
        onSuccess: () => {
          setIsSubmitting(false)
        },
        onClose: () => {
          setIsSubmitting(false)
        },
      },
    })
  }

  // Get current nominations
  const nominations = getNominations(activeAccount || '')
  const hasNominations = nominations?.length > 0

  // Toggle validator selection
  const toggleValidator = (address: string) => {
    if (selectedValidators.includes(address)) {
      setSelectedValidators(selectedValidators.filter((a) => a !== address))
    } else {
      setSelectedValidators([...selectedValidators, address])
    }
  }

  return (
    <Wrapper>
      <Page.Title title={t('validatorInvite')} />

      {isLoading ? (
        <LoadingState>
          <h3>{t('loading')}...</h3>
        </LoadingState>
      ) : validatorAddresses === null || validatorAddresses.length === 0 ? (
        <ErrorState>
          <h3>{t('noValidatorsInUrl')}</h3>
          <p>{t('noValidatorsInUrlDescription')}</p>
        </ErrorState>
      ) : (
        <>
          <Page.Row>
            <ValidatorsToNominate count={validatorAddresses.length} />
            <SelectedValidators count={selectedValidators.length} />
            <AverageCommission validators={filteredValidators} />
          </Page.Row>

          {hasNominations && (
            <WarningMessage>
              <h3>{t('existingNominations')}</h3>
              <p>{t('existingNominationsDescription')}</p>
            </WarningMessage>
          )}

          <Page.Row>
            <CardWrapper>
              {!isReady ? (
                <div className="item">
                  <h3>{t('connecting')}...</h3>
                </div>
              ) : filteredValidators.length === 0 ? (
                <div className="empty-state">
                  <h3>{t('noValidatorsFound')}</h3>
                </div>
              ) : (
                <ValidatorListContainer>
                  <div className="validator-grid">
                    {filteredValidators.map((validator) => {
                      const { address, prefs } = validator
                      const isSelected = selectedValidators.includes(address)
                      const { validatorIdentities, validatorSupers } =
                        validatorsContext

                      // Get identity display
                      const identityDisplay = getIdentityDisplay(
                        validatorIdentities[address],
                        validatorSupers[address]
                      )

                      // Format commission
                      const commission = prefs?.commission
                        ? (prefs.commission / 10000000).toFixed(2)
                        : '0.00'

                      return (
                        <div
                          key={address}
                          className={`validator-card ${
                            isSelected ? 'selected' : ''
                          }`}
                          onClick={() => toggleValidator(address)}
                        >
                          <div className="card-header">
                            <div className="checkbox-wrapper">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleValidator(address)}
                                id={`validator-${address}`}
                              />
                            </div>
                            <div className="identity">
                              <Polkicon address={address} fontSize="2rem" />
                              <div className="name">
                                {identityDisplay.node || ellipsisFn(address, 6)}
                              </div>
                            </div>
                            <div className="actions">
                              <CopyAddress address={address} />
                            </div>
                          </div>

                          <div className="card-content">
                            <div className="era-points">
                              <CurrentEraPoints
                                address={address}
                                displayFor="default"
                              />
                            </div>
                            <div className="metrics">
                              <div className="commission">
                                <TooltipArea
                                  text={t('commission')}
                                  onMouseMove={() =>
                                    setTooltipTextAndOpen(t('commission'))
                                  }
                                >
                                  <span>{commission}%</span>
                                </TooltipArea>
                              </div>
                              <div className="status">
                                <TooltipArea
                                  text={t('status')}
                                  onMouseMove={() =>
                                    setTooltipTextAndOpen(t('status'))
                                  }
                                >
                                  <span>{t('validator')}</span>
                                </TooltipArea>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ValidatorListContainer>
              )}

              <ActionButtonsWrapper>
                <ButtonPrimary
                  iconLeft={faChevronCircleRight}
                  disabled={
                    selectedValidators.length === 0 ||
                    !activeAccount ||
                    isSubmitting
                  }
                  onClick={handleNominate}
                  text={
                    isSubmitting
                      ? `${t('nominating')}...`
                      : t('nominateValidators')
                  }
                />
              </ActionButtonsWrapper>
            </CardWrapper>
          </Page.Row>
        </>
      )}
    </Wrapper>
  )
}

// Main component that doesn't use the tabs context
export const ValidatorInvitePage = () => <ValidatorInvitePageInner />
