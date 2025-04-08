// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn, unitToPlanck } from '@w3ux/utils'
import { NewNominator } from 'api/tx/newNominator'
import { StakingNominate } from 'api/tx/stakingNominate'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useBonded } from 'contexts/Bonded'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useBatchCall } from 'hooks/useBatchCall'
import { useBondGreatestFee } from 'hooks/useBondGreatestFee'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { CardWrapper } from 'library/Card/Wrappers'
import { BondFeedback } from 'library/Form/Bond/BondFeedback'
import { Warning } from 'library/Form/Warning'
import { Spacer } from 'library/Form/Wrappers'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Buttons/CopyAddress'
import { PayeeInput } from 'library/PayeeInput'
import { SelectItems } from 'library/SelectItems'
import { SelectItem } from 'library/SelectItems/Item'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { ButtonPrimary, ButtonSecondary } from 'ui-buttons'
import { Page, Stat } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'
import { AverageCommission } from './Stats/AverageCommission'
import { SelectedValidators } from './Stats/SelectedValidators'
import {
  ActionButtonsWrapper,
  ErrorState,
  LoadingState,
  NominationSteps,
  PayeeInputWrapper,
  StepContainer,
  StepNumber,
  SummaryItem,
  ValidatorInviteWrapper,
  ValidatorListContainer,
  WarningsWrapper,
} from './Wrappers'

export const ValidatorInvitePage = () => {
  const { t } = useTranslation('invite')
  const { activeAccount, activeProxy } = useActiveAccounts()
  const { isReady } = useApi()
  const { modal } = useOverlay()
  const navigate = useNavigate()
  const { network: urlNetwork, validators } = useParams<{
    network: string
    validators: string
  }>()
  const location = window.location.search
  const { getBondedAccount } = useBonded()
  const { getNominations } = useBalances()
  const { getAccount, accountHasSigner } = useImportedAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { inSetup } = useStaking()
  const {
    formatWithPrefs,
    validatorIdentities,
    validatorSupers,
    fetchValidatorPrefs,
    getValidatorTotalStake,
  } = useValidators()
  const { network } = useNetwork()
  const {
    networkData: { units, unit },
  } = useNetwork()
  const { getTransferOptions } = useTransferOptions()
  const largestTxFee = useBondGreatestFee({ bondFor: 'nominator' })
  const { getPayeeItems } = usePayeeConfig()
  const { newBatchCall } = useBatchCall()
  const {
    eraStakers: { stakers },
  } = useStaking()
  const { i18n } = useTranslation()

  // Extract language from URL query parameters
  useEffect(() => {
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
  }, [location, i18n])

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
  const [payeeAccount, setPayeeAccount] = useState<string | null>(null)

  // Get transfer options for the active account
  const transferOptions = activeAccount
    ? getTransferOptions(activeAccount)
    : null

  // Check if this is a new nominator setup
  const isNewNominator = inSetup()

  // Get controller account for signing transactions
  const controller = activeAccount ? getBondedAccount(activeAccount) : null

  // For staking operations, we need to use the controller account to sign
  // This is crucial - for nominator operations, we must use the controller account
  const signingAccount = isNewNominator ? activeAccount : controller

  // Get existing nominations for validation
  const existingNominations = getNominations(activeAccount)

  // Extract validators from URL params
  useEffect(() => {
    if (validators) {
      try {
        // Validate network matches
        if (network !== urlNetwork) {
          setLoadingError(
            t('wrongNetwork', { expected: urlNetwork, current: network })
          )
          return
        }

        // Split the list by delimiter and filter out empty values
        const extractedValidators = validators.split('|').filter(Boolean)

        if (extractedValidators.length > 0) {
          setUrlValidators(extractedValidators)
          setSelectedValidators(extractedValidators)

          // Mark nominate step as complete if validators are selected
          setNominateComplete(extractedValidators.length > 0)

          // Fetch validator preferences
          const validatorAddresses = extractedValidators.map((address) => ({
            address,
          }))
          fetchValidatorPrefs(validatorAddresses)
        } else {
          setLoadingError(t('noValidatorsInUrl'))
        }
      } catch (error) {
        setLoadingError(t('invalidValidatorsInUrl'))
      }
    }
  }, [validators, network, urlNetwork, fetchValidatorPrefs, t])

  // Set initial bond value when account or transfer options change
  useEffect(() => {
    if (activeAccount && transferOptions && bond.bond === '') {
      // Use transferrableBalance directly
      const initialBond = planckToUnitBn(
        transferOptions.transferrableBalance,
        units
      ).toString()

      if (initialBond !== '0') {
        setBond({ bond: initialBond })
      }
    }
  }, [activeAccount, transferOptions, units, bond.bond])

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
    const bondValue = new BigNumber(bond.bond || '0')
    const minimumBond = new BigNumber('260') // 260 DOT minimum
    const newErrors = [...feedbackErrors]
    const minimumBondError = t('minimumBondRequired', {
      minimum: '260',
      unit: units,
    })

    // Remove any existing minimum bond error
    const filteredErrors = newErrors.filter(
      (error) => error !== minimumBondError
    )

    // Add minimum bond error if needed
    if (bondValue.isLessThan(minimumBond)) {
      filteredErrors.push(minimumBondError)
      setBondValid(false)
    }

    // Only update if errors have changed
    if (JSON.stringify(filteredErrors) !== JSON.stringify(feedbackErrors)) {
      setFeedbackErrors(filteredErrors)
    }

    setBondComplete(bondValid && filteredErrors.length === 0)
  }, [bond.bond, units, t])

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
  const handlePayeeAccountChange = (account: string | null) => {
    setPayeeAccount(account)
  }

  // Get the transaction to submit
  const getTx = () => {
    if (!activeAccount || !bondValid || selectedValidators.length === 0) {
      return null
    }

    try {
      // Format nominees properly with the expected structure
      const formattedNominees = selectedValidators.map((validator) => ({
        type: 'Id',
        value: validator,
      }))

      // Create the payee object in the correct format based on type
      let payeeConfig
      if (payee.type === 'Account') {
        payeeConfig = { type: 'Account' as const, value: payeeAccount || '' }
      } else {
        payeeConfig = {
          type: payee.type as 'Stash' | 'Staked' | 'None' | 'Controller',
        }
      }

      if (isNewNominator) {
        // For new nominators, we need to bond and nominate
        const tx = new NewNominator(
          network,
          unitToPlanck(bond.bond, units),
          payeeConfig,
          formattedNominees
        ).tx()

        if (!tx) {
          return null
        }

        // Batch the bond and nominate transactions together
        return newBatchCall(tx, activeAccount)
      } else {
        // For existing nominators, just nominate
        return new StakingNominate(network, formattedNominees).tx()
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      return null
    }
  }

  // Check if the controller account is imported and has a signer
  const controllerAccount = getAccount(controller)
  const controllerImported = !!controllerAccount
  const canSign =
    accountHasSigner(activeAccount) ||
    (activeProxy && accountHasSigner(activeProxy)) ||
    (!isNewNominator && controllerImported && accountHasSigner(controller))

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
      // Navigate to staking page after successful transaction
      setTimeout(() => {
        navigate('/stake')
      }, 2000)
    },
  })

  // Get signer warnings
  const warnings = getSignerWarnings(
    activeAccount,
    !isNewNominator,
    submitExtrinsic.proxySupported
  )

  // Add warning if account cannot sign
  if (!canSign) {
    warnings.push(t('readOnly', { ns: 'modals' }))
  }

  // Add warning if controller not imported
  if (!isNewNominator && !controllerImported) {
    warnings.push(t('controllerAccountNotImported', { ns: 'modals' }))
  }

  // Add warning if no nominations
  if (selectedValidators.length === 0) {
    warnings.push(t('noNominationsSet', { ns: 'modals' }))
  }

  // Add warning if already nominating these validators
  if (existingNominations.length > 0 && !isNewNominator) {
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
      setActiveStep((prev) => Math.min(prev + 1, isNewNominator ? 4 : 3))
    }
  }

  // Navigate to previous step
  const goToPrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1))
  }

  // If not ready, show loading state
  if (!isReady) {
    return (
      <ValidatorInviteWrapper>
        <Page.Title title={t('validatorInvite')} />
        <Page.Row>
          <Page.RowSection>
            <LoadingState>
              <h3>{t('connecting')}</h3>
            </LoadingState>
          </Page.RowSection>
        </Page.Row>
      </ValidatorInviteWrapper>
    )
  }

  if (loadingError) {
    return (
      <ValidatorInviteWrapper>
        <Page.Title title={t('validatorInvite')} />
        <Page.Row>
          <Page.RowSection>
            <ErrorState>
              <h3>{loadingError}</h3>
            </ErrorState>
          </Page.RowSection>
        </Page.Row>
      </ValidatorInviteWrapper>
    )
  }

  // Format validators with their preferences
  const validValidators = formatWithPrefs(urlValidators)

  // Determine if all steps are complete
  const allStepsComplete = payoutComplete && nominateComplete && bondComplete

  // Determine which steps to show based on whether user is a new nominator
  const steps = isNewNominator
    ? [
        { id: 1, label: t('payoutDestination'), complete: payoutComplete },
        {
          id: 2,
          label: t('nominate'),
          complete: payoutComplete && nominateComplete,
        },
        {
          id: 3,
          label: t('bondStep'),
          complete: payoutComplete && nominateComplete && bondComplete,
        },
        { id: 4, label: t('summary'), complete: false },
      ]
    : [
        { id: 1, label: t('nominate'), complete: nominateComplete },
        {
          id: 2,
          label: t('bondStep'),
          complete: nominateComplete && bondComplete,
        },
        { id: 3, label: t('summary'), complete: false },
      ]

  // Update the step container to only be active if previous steps are complete
  const isStepAvailable = (stepId: number) => {
    if (stepId === 1) {
      return true
    }
    const previousStep = steps[stepId - 2]
    return previousStep?.complete || false
  }

  return (
    <ValidatorInviteWrapper>
      <Page.Title title={t('validatorInvite')} />
      <Page.Row>
        <Page.RowSection>
          <CardWrapper>
            <NominationSteps>
              {steps.map((step) => (
                <StepContainer key={step.id}>
                  <StepNumber
                    $active={activeStep === step.id && isStepAvailable(step.id)}
                    $complete={step.complete}
                  >
                    <span className="number">{step.id}.</span>
                    <span className="label">{step.label}</span>
                  </StepNumber>

                  {activeStep === step.id && isStepAvailable(step.id) && (
                    <>
                      {/* Payout Destination Step */}
                      {step.id === 1 && isNewNominator && (
                        <>
                          <p>{t('payoutDestinationInfo')}</p>
                          <SelectItems layout="three-col">
                            {getPayeeItems().map((item) => (
                              <SelectItem
                                key={`payee_option_${item.value}`}
                                account={payeeAccount}
                                setAccount={setPayeeAccount}
                                selected={payee.type === item.value}
                                onClick={() => handlePayeeChange(item.value)}
                                layout="three-col"
                                icon={item.icon}
                                title={item.title}
                                subtitle={item.subtitle}
                              />
                            ))}
                          </SelectItems>

                          <Spacer />

                          {payee.type === 'Account' && (
                            <PayeeInputWrapper>
                              <PayeeInput
                                payee={{
                                  destination: payee.type,
                                  account: payeeAccount,
                                }}
                                account={payeeAccount}
                                setAccount={setPayeeAccount}
                                handleChange={handlePayeeAccountChange}
                              />
                            </PayeeInputWrapper>
                          )}

                          {payee.type === 'Stash' && (
                            <p>{t('usingStashForPayouts')}</p>
                          )}
                        </>
                      )}

                      {/* Nominate Step */}
                      {((isNewNominator && step.id === 2) ||
                        (!isNewNominator && step.id === 1)) && (
                        <>
                          <p>{t('validatorInviteDescription')}</p>
                          <Stat.Row>
                            <SelectedValidators
                              count={selectedValidators.length}
                              hideHelp
                            />
                            <AverageCommission
                              validators={validValidators.filter((v) =>
                                selectedValidators.includes(v.address)
                              )}
                              hideHelp
                            />
                          </Stat.Row>

                          <ValidatorListContainer>
                            <div className="validator-grid">
                              {validValidators.map(({ address, prefs }) => {
                                const identityDisplay = getIdentityDisplay(
                                  validatorIdentities[address] || null,
                                  validatorSupers[address] || null
                                )

                                // Format stake and commission values
                                const commissionValue = prefs?.commission ?? 0
                                const commissionPercent =
                                  commissionValue.toFixed(2)

                                // Get validator's total stake and format to 2 decimal places
                                const totalStake =
                                  getValidatorTotalStake(address)
                                const formattedStake = planckToUnitBn(
                                  new BigNumber(totalStake.toString()),
                                  units
                                ).toFormat(2)

                                // Check if validator is active
                                const isActive = stakers.some(
                                  (s) => s.address === address
                                )

                                return (
                                  <div
                                    key={address}
                                    className={`validator-item ${selectedValidators.includes(address) ? 'selected' : ''}`}
                                    data-testid={`validator-card-${address}`}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      const newSelection =
                                        selectedValidators.includes(address)
                                          ? selectedValidators.filter(
                                              (a) => a !== address
                                            )
                                          : [...selectedValidators, address]
                                      setSelectedValidators(newSelection)
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <div className="validator-header">
                                      <div className="identity">
                                        <Polkicon address={address} />
                                        <span className="name">
                                          {identityDisplay.node ||
                                            ellipsisFn(address)}
                                        </span>
                                      </div>
                                      <div className="validator-info">
                                        <div className="commission-value">
                                          <span className="label">
                                            {t('commission')}:
                                          </span>
                                          <span className="value">
                                            {commissionPercent}%
                                          </span>
                                        </div>
                                        <div className="status-info">
                                          <span
                                            className={`status ${isActive ? 'active' : ''}`}
                                          >
                                            {isActive
                                              ? t('active')
                                              : t('inactive')}
                                          </span>
                                          <span className="dot-amount">
                                            {formattedStake} {unit}
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
                        </>
                      )}

                      {/* Bond Step */}
                      {((isNewNominator && step.id === 3) ||
                        (!isNewNominator && step.id === 2)) && (
                        <>
                          <p>{t('bondDescription', { unit })}</p>
                          <BondFeedback
                            bondFor="nominator"
                            displayFirstWarningOnly
                            syncing={largestTxFee.isZero()}
                            listenIsValid={(valid, errors) => {
                              setBondValid(valid)
                              setFeedbackErrors(errors)
                            }}
                            defaultBond={bond.bond !== '' ? bond.bond : null}
                            setters={[handleSetBond]}
                            txFees={BigInt(largestTxFee.toString())}
                            maxWidth
                          />
                        </>
                      )}

                      {/* Summary Step */}
                      {((isNewNominator && step.id === 4) ||
                        (!isNewNominator && step.id === 3)) && (
                        <>
                          <div>
                            <SummaryItem>
                              <span className="label">
                                {t('selectedValidators')}
                              </span>
                              <span className="value">
                                {selectedValidators.length}
                              </span>
                            </SummaryItem>
                            <SummaryItem>
                              <span className="label">{t('bondAmount')}</span>
                              <span className="value">
                                {bond.bond} {units}
                              </span>
                            </SummaryItem>
                            {isNewNominator && (
                              <SummaryItem>
                                <span className="label">
                                  {t('payoutDestination')}
                                </span>
                                <span className="value">{t('stash')}</span>
                              </SummaryItem>
                            )}
                          </div>

                          {warnings.length > 0 && (
                            <WarningsWrapper>
                              {warnings.map((text, i) => (
                                <Warning key={`warning${i}`} text={text} />
                              ))}
                            </WarningsWrapper>
                          )}
                        </>
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
                                : isNewNominator
                                  ? t('bondAndNominate', { ns: 'modals' })
                                  : t('nominateValidators')
                            }
                            onClick={() => {
                              if (!activeAccount) {
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
                    </>
                  )}
                </StepContainer>
              ))}
            </NominationSteps>
          </CardWrapper>
        </Page.RowSection>
      </Page.Row>
    </ValidatorInviteWrapper>
  )
}
