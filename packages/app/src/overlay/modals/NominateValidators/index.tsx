// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NewNominator } from 'api/tx/newNominator'
import { StakingNominate } from 'api/tx/stakingNominate'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useBonded } from 'contexts/Bonded'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Padding, Title, Warnings } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const NominateValidators = () => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { getBondedAccount } = useBonded()
  const { getNominations } = useBalances()
  const { activeAddress, activeProxy } = useActiveAccounts()
  const { getAccount, accountHasSigner } = useImportedAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { inSetup } = useStaking()
  const {
    setModalStatus,
    config: { options },
  } = useOverlay().modal

  // Extract options from modal
  const { nominations, bondFor, bondAmount, nominees } = options || {}
  const isNominator = bondFor === 'nominator'

  // Get controller account
  const controller = getBondedAccount(activeAddress)

  // For staking operations, we need to use the controller account to sign
  // This is crucial - for nominator operations, we must use the controller account
  const signingAccount = isNominator ? controller : activeAddress

  // Check if this is a new nominator or existing one
  const isNewNominator = inSetup()

  // Get existing nominations for validation
  const existingNominations = getNominations(activeAddress)

  // valid to submit transaction
  const [valid, setValid] = useState(false)

  // ensure nominations are valid
  useEffect(() => {
    setValid(
      nominations?.length > 0 &&
        bondAmount &&
        BigInt(bondAmount.toString()) > 0n
    )
  }, [nominations, bondAmount])

  // Get the transaction to submit
  const getTx = () => {
    if (!valid || !activeAddress) {
      return null
    }

    try {
      // Format nominees properly with the expected structure
      const formattedNominees = (nominees || []).map((address: string) => ({
        type: 'Id',
        value: address,
      }))

      if (isNewNominator) {
        // For new nominators, we need to bond and nominate
        return new NewNominator(
          network,
          BigInt(bondAmount.toString()),
          { type: 'Stash' }, // Default payee
          formattedNominees
        ).tx()
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
    accountHasSigner(activeAddress) ||
    (activeProxy && accountHasSigner(activeProxy.address)) ||
    (isNominator && controllerImported && accountHasSigner(controller))

  // Submit extrinsic
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  // Get signer warnings
  const warnings = getSignerWarnings(
    activeAddress,
    isNominator,
    submitExtrinsic.proxySupported
  )

  // Add warning if account cannot sign
  if (!canSign) {
    warnings.push(t('readOnly'))
  }

  // Add warning if controller not imported
  if (isNominator && !controllerImported) {
    warnings.push(t('controllerAccountNotImported', { ns: 'modals' }))
  }

  // Add warning if no nominations
  if (!nominations?.length) {
    warnings.push(`${t('noNominationsSet')}`)
  }

  // Add warning if already nominating these validators
  if (existingNominations.length > 0 && !isNewNominator) {
    const allExistingNominated = existingNominations.every((nom) =>
      nominations.includes(nom)
    )

    if (
      allExistingNominated &&
      existingNominations.length === nominations.length
    ) {
      warnings.push(`${t('alreadyNominatingThese', { ns: 'invite' })}`)
    } else {
      warnings.push(`${t('alreadyNominatingOthers', { ns: 'invite' })}`)
    }
  }

  // Add warning if bond amount is too small
  if (!bondAmount || BigInt(bondAmount.toString()) <= 0n) {
    warnings.push(`${t('invalidBondAmount')}`)
  }

  // Create the button text
  const buttonText = isNewNominator ? t('bondAndNominate') : t('nominate')

  return (
    <>
      <Close />
      <Padding>
        <Title>
          {t('nominate')} {t('validators')}
        </Title>
        {warnings.length > 0 && (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        )}
      </Padding>
      <SubmitTx
        valid={valid && warnings.length === 0}
        submitText={buttonText}
        fromController={isNominator}
        {...submitExtrinsic}
      />
    </>
  )
}
