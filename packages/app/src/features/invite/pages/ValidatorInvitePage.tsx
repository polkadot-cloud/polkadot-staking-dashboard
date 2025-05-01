// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils'
import type BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { AccountId32 } from 'dedot/codecs'
import { useBatchCall } from 'hooks/useBatchCall'
import { useBondGreatestFee } from 'hooks/useBondGreatestFee'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { CardWrapper } from 'library/Card/Wrappers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import type { MaybeAddress } from 'types'
import { ButtonPrimary, ButtonSecondary } from 'ui-buttons'
import { Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { BondAmountStep } from '../components/BondAmountStep'
import type { ValidatorWithPrefs } from '../components/NominateValidatorsStep'
import { NominateValidatorsStep } from '../components/NominateValidatorsStep'
import { PayoutDestinationStep } from '../components/PayoutDestinationStep'
import { SummaryStep } from '../components/SummaryStep'
import {
  ActionButtonsWrapper,
  ErrorState,
  LoadingState,
  NominationStepsWrapper,
  StepContainer,
  StepContent,
  StepHeader,
  StepIndicator,
  Wrapper,
} from './Wrappers'

export const ValidatorInvitePage = () => {
  const { t, i18n } = useTranslation('invite')
  const {
    formatWithPrefs,
    validatorIdentities,
    validatorSupers,
    fetchValidatorPrefs,
    getValidatorTotalStake,
  } = useValidators()
  const { modal } = useOverlay()
  const navigate = useNavigate()
  const { inSetup } = useStaking()
  const { network, switchNetwork } = useNetwork()
  const { isReady, serviceApi } = useApi()
  const { getSignerWarnings } = useSignerWarnings()
  const { accountHasSigner } = useImportedAccounts()
  const { getNominations, getStakingLedger } = useBalances()
  const { activeAddress, activeProxy } = useActiveAccounts()
  const { network: urlNetwork, validators } = useParams<{
    network: string
    validators: string
  }>()

  const { controllerUnmigrated } = getStakingLedger(activeAddress)
  const location = window.location.search
  const largestTxFee = useBondGreatestFee({ bondFor: 'nominator' })
  const { getPayeeItems } = usePayeeConfig()
  const { newBatchCall } = useBatchCall()
  const {
    eraStakers: { stakers },
  } = useStaking()

  // Extract language from URL query parameters and handle network switching
  useEffect(() => {
    // Handle language from URL
    if (location) {
      const params = new URLSearchParams(location)
      const langParam = params.get('l')

      // Change language if valid and different from current
      if (
        langParam &&
        i18n.language !== langParam &&
        i18n.languages.includes(langParam)
      ) {
        i18n.changeLanguage(langParam)
      }
    }

    // Handle network switching if URL network doesn't match current network
    if (urlNetwork && urlNetwork !== network) {
      // Only switch if the network from URL is valid
      if (['polkadot', 'kusama', 'westend'].includes(urlNetwork)) {
        // Switch to the network specified in the URL
        switchNetwork(urlNetwork as 'polkadot' | 'kusama' | 'westend')
      }
    }
  }, [location, i18n, urlNetwork, network, switchNetwork])

  const { units, unit } = getNetworkData(network)

  // State for validators from URL
  const [urlValidators, setUrlValidators] = useState<string[]>([])
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [selectedValidators, setSelectedValidators] = useState<string[]>([])

  // Bond amount state
  const [bond, setBond] = useState<{ bond: string }>({ bond: '' })
  const [bondValid, setBondValid] = useState<boolean>(false)
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([])

  // Transaction submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nominating, setNominating] = useState(false)

  // Step completion state
  const [payoutComplete, setPayoutComplete] = useState(false)
  const [nominateComplete, setNominateComplete] = useState(false)
  const [bondComplete, setBondComplete] = useState(false)

  // Active step state - start with payout for new nominators
  const [activeStep, setActiveStep] = useState(1)

  // Payee selection (default to Stash)
  const [payee, setPayee] = useState({ type: 'Stash' })
  const [payeeAccount, setPayeeAccount] = useState<MaybeAddress>(null)

  const signingAccount = activeAddress

  // Get existing nominations for validation
  const existingNominations = getNominations(activeAddress)

  // Effect to fetch validator data when API is ready
  useEffect(() => {
    const fetchValidators = async () => {
      try {
        if (!isReady || !serviceApi || !validators || !urlNetwork) {
          return
        }

        // Validate network matches
        if (network !== urlNetwork) {
          setLoadingError(
            t('wrongNetwork', { expected: urlNetwork, current: network })
          )
          return
        }

        console.log('Fetching validators from URL:', validators)
        // Split the validator string by the delimiter
        const validatorList = validators.split('|').filter(Boolean)
        setUrlValidators(validatorList)

        if (validatorList.length === 0) {
          setLoadingError(t('noValidatorsFound'))
          return
        }

        // Convert to validator addresses format
        const validatorAddresses = validatorList.map((address) => ({
          address,
        }))

        // Fetch validator preferences
        await fetchValidatorPrefs(validatorAddresses)

        // Set selected validators and mark nominate step as complete
        setSelectedValidators(validatorList)
        setNominateComplete(validatorList.length > 0)
      } catch (error) {
        console.error('Error fetching validators:', error)
        setLoadingError(t('errorLoadingValidators'))
      }
    }

    // Only attempt to fetch validators when API is ready
    if (isReady) {
      fetchValidators()
    }
  }, [
    isReady,
    serviceApi,
    validators,
    urlNetwork,
    network,
    fetchValidatorPrefs,
    t,
  ])

  // Update payout completion status when payee is valid
  useEffect(() => {
    setPayoutComplete(
      payee.type !== null &&
        (payee.type !== 'Account' ||
          (payee.type === 'Account' && payeeAccount !== null))
    )
  }, [payee, payeeAccount])

  // Update nominate completion status when validators are selected
  useEffect(() => {
    setNominateComplete(selectedValidators.length > 0)
  }, [selectedValidators])

  // Update bond completion status when bond is valid and meets minimum requirement
  useEffect(() => {
    // BondFeedback component now handles validation and will set bondValid to false
    // if the bond amount is less than the minimum required
    setBondComplete(bondValid && feedbackErrors.length === 0)
  }, [bondValid, feedbackErrors])

  // Handler to set bond on input change
  const handleSetBond = (value: { bond: BigNumber }) => {
    setBond({ bond: value.bond.toString() })
  }

  // Handle payee change
  const handlePayeeChange = (
    destination: 'Stash' | 'Staked' | 'Account' | 'None' | 'Controller'
  ) => {
    // Only allow valid payee types
    if (destination === 'Controller') {
      setPayee({ type: 'Stash' })
    } else {
      setPayee({ type: destination })
    }
  }

  // Handle payee account change
  const handlePayeeAccountChange = (account: MaybeAddress) => {
    setPayeeAccount(account)
  }

  // Get the transaction to submit
  const getTx = () => {
    if (!activeAddress || !bondValid || selectedValidators.length === 0) {
      return
    }

    try {
      // Create the payee object in the correct format based on type
      let payeeConfig
      if (payee.type === 'Account') {
        payeeConfig = {
          type: 'Account' as const,
          value: new AccountId32(payeeAccount || ''),
        }
      } else {
        payeeConfig = {
          type: payee.type as 'Stash' | 'Staked' | 'None' | 'Controller',
        }
      }

      if (inSetup()) {
        // For new nominators, we need to bond and nominate
        const tx = serviceApi.tx.newNominator(
          unitToPlanck(bond.bond || '0', units),
          payeeConfig,
          selectedValidators
        )
        if (!tx) {
          return
        }
        // Batch the bond and nominate transactions together
        return newBatchCall(tx, activeAddress)
      } else {
        // For existing nominators, just nominate
        return serviceApi.tx.stakingNominate(selectedValidators)
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      return
    }
  }

  // Check if the controller account is imported and has a signer
  const canSign =
    accountHasSigner(activeAddress) ||
    (activeProxy && accountHasSigner(activeProxy.address)) ||
    (!inSetup() && !controllerUnmigrated)

  // Set up the transaction submission
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: bondValid && selectedValidators.length > 0,
    callbackSubmit: () => {
      setNominating(true)
      setIsSubmitting(true)
    },
    callbackInBlock: () => {
      // Navigate to nominate page after successful transaction
      setTimeout(() => {
        navigate('/nominate')
      }, 2000)
    },
  })

  // Get signer warnings
  const warnings = getSignerWarnings(
    activeAddress,
    !inSetup(),
    submitExtrinsic.proxySupported
  )

  // Add warning if account cannot sign
  if (!canSign) {
    warnings.push(t('readOnly', { ns: 'modals' }))
  }

  // Add warning if controller not migrated
  if (!inSetup() && controllerUnmigrated) {
    warnings.push(t('controllerNotMigrated', { ns: 'modals' }))
  }

  // Add warning if no nominations
  if (selectedValidators.length === 0) {
    warnings.push(t('noNominationsSet', { ns: 'modals' }))
  }

  // Add warning if already nominating these validators
  if (existingNominations.length > 0 && !inSetup()) {
    const allExistingNominated = existingNominations.every((nom) =>
      selectedValidators.includes(nom)
    )

    if (
      allExistingNominated &&
      existingNominations.length === selectedValidators.length
    ) {
      warnings.push(t('alreadyNominatingThese'))
    } else {
      warnings.push(t('alreadyNominatingOthers'))
    }
  }

  // Navigate to next step
  const goToNextStep = () => {
    if (isStepAvailable(activeStep + 1)) {
      setActiveStep((prev) => Math.min(prev + 1, inSetup() ? 4 : 3))
    }
  }

  // Navigate to previous step
  const goToPrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1))
  }

  // Update the step container to only be active if previous steps are complete
  const isStepAvailable = (stepId: number) => {
    if (stepId === 1) {
      return true
    }
    const step = steps[stepId - 1]
    return step?.available || false
  }

  // If not ready, show loading state
  if (!isReady) {
    return (
      <Page.Container>
        <Wrapper>
          <Page.Title title={t('validatorInvite')} />
          <Page.Row>
            <CardWrapper>
              <LoadingState>
                <h3>{t('connecting')}</h3>
              </LoadingState>
            </CardWrapper>
          </Page.Row>
        </Wrapper>
      </Page.Container>
    )
  }

  if (loadingError) {
    return (
      <Page.Container>
        <Wrapper>
          <Page.Title title={t('validatorInvite')} />
          <Page.Row>
            <CardWrapper>
              <ErrorState>
                <h3>{loadingError}</h3>
              </ErrorState>
            </CardWrapper>
          </Page.Row>
        </Wrapper>
      </Page.Container>
    )
  }

  // Format validators with their preferences
  const validValidators = formatWithPrefs(urlValidators) as ValidatorWithPrefs[]

  // Determine if all steps are complete
  const allStepsComplete = payoutComplete && nominateComplete && bondComplete

  // Determine which steps to show based on whether user is a new nominator
  const steps = inSetup()
    ? [
        { id: 1, label: t('payoutDestination'), complete: payoutComplete },
        {
          id: 2,
          label: t('nominate'),
          complete: payoutComplete && nominateComplete,
          available: payoutComplete,
        },
        {
          id: 3,
          label: t('bondStep'),
          complete: payoutComplete && nominateComplete && bondComplete,
          available: payoutComplete && nominateComplete,
        },
        {
          id: 4,
          label: t('summary'),
          complete: payoutComplete && nominateComplete && bondComplete,
          available: payoutComplete && nominateComplete && bondComplete,
        },
      ]
    : [
        { id: 1, label: t('nominate'), complete: nominateComplete },
        {
          id: 2,
          label: t('bondStep'),
          complete: nominateComplete && bondComplete,
          available: nominateComplete,
        },
        {
          id: 3,
          label: t('summary'),
          complete: nominateComplete && bondComplete,
          available: nominateComplete && bondComplete,
        },
      ]

  return (
    <Page.Container>
      <Wrapper>
        <Page.Title title={t('validatorInvite')} />
        <Page.Row>
          <CardWrapper>
            <NominationStepsWrapper>
              {steps.map((step) => (
                <StepContainer key={step.id}>
                  <StepHeader
                    $active={activeStep === step.id && isStepAvailable(step.id)}
                    $complete={step.complete}
                    onClick={() => {
                      if (isStepAvailable(step.id)) {
                        setActiveStep(step.id)
                      }
                    }}
                  >
                    <StepIndicator
                      $active={activeStep === step.id}
                      $complete={step.complete}
                    >
                      {step.id}
                    </StepIndicator>
                    <span className="label">{step.label}</span>
                  </StepHeader>

                  {activeStep === step.id && isStepAvailable(step.id) && (
                    <StepContent>
                      {/* Payout Destination Step */}
                      {step.id === 1 && inSetup() && (
                        <PayoutDestinationStep
                          payee={payee}
                          payeeAccount={payeeAccount}
                          handlePayeeChange={handlePayeeChange}
                          handlePayeeAccountChange={handlePayeeAccountChange}
                          getPayeeItems={getPayeeItems}
                        />
                      )}

                      {/* Nominate Step */}
                      {((inSetup() && step.id === 2) ||
                        (!inSetup() && step.id === 1)) && (
                        <NominateValidatorsStep
                          selectedValidators={selectedValidators}
                          setSelectedValidators={setSelectedValidators}
                          validValidators={validValidators}
                          validatorIdentities={validatorIdentities}
                          validatorSupers={validatorSupers}
                          getValidatorTotalStake={getValidatorTotalStake}
                          stakers={stakers}
                          units={units}
                          unit={unit}
                        />
                      )}

                      {/* Bond Step */}
                      {((inSetup() && step.id === 3) ||
                        (!inSetup() && step.id === 2)) && (
                        <BondAmountStep
                          unit={unit}
                          units={units}
                          bondAmount={bond.bond}
                          handleSetBond={handleSetBond}
                          setBondValid={setBondValid}
                          setFeedbackErrors={setFeedbackErrors}
                          largestTxFee={largestTxFee}
                        />
                      )}

                      {/* Summary Step */}
                      {((inSetup() && step.id === 4) ||
                        (!inSetup() && step.id === 3)) && (
                        <SummaryStep
                          selectedValidatorsCount={selectedValidators.length}
                          bondAmount={bond.bond}
                          isNewNominator={inSetup()}
                          warnings={warnings}
                          payee={payee}
                          payeeAccount={payeeAccount}
                        />
                      )}

                      <ActionButtonsWrapper>
                        {step.id > 1 && (
                          <ButtonSecondary
                            text={t('back')}
                            onClick={goToPrevStep}
                            marginLeft
                          />
                        )}
                        {step.id < steps.length ? (
                          <ButtonPrimary
                            text={t('continue')}
                            onClick={goToNextStep}
                            disabled={!step.complete}
                          />
                        ) : (
                          <ButtonPrimary
                            text={
                              nominating
                                ? t('nominating')
                                : inSetup()
                                  ? t('bondAndNominate', { ns: 'modals' })
                                  : t('nominateValidators')
                            }
                            onClick={() => {
                              if (!activeAddress) {
                                modal.openModal({
                                  key: 'Connect',
                                  options: { forceConnection: true },
                                })
                                return
                              }
                              submitExtrinsic.onSubmit()
                            }}
                            disabled={
                              !allStepsComplete ||
                              warnings.length > 0 ||
                              isSubmitting
                            }
                          />
                        )}
                      </ActionButtonsWrapper>
                    </StepContent>
                  )}
                </StepContainer>
              ))}
            </NominationStepsWrapper>
          </CardWrapper>
        </Page.Row>
      </Wrapper>
    </Page.Container>
  )
}
