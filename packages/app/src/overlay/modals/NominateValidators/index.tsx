// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useStaking } from 'contexts/Staking'
import { useBatchCall } from 'hooks/useBatchCall'
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
  const { inSetup } = useStaking()
  const { serviceApi } = useApi()
  const { newBatchCall } = useBatchCall()
  const { getSignerWarnings } = useSignerWarnings()
  const { getNominations, getStakingLedger } = useBalances()
  const { activeAddress, activeProxy } = useActiveAccounts()
  const { accountHasSigner } = useImportedAccounts()
  const {
    setModalStatus,
    config: { options },
  } = useOverlay().modal
  const { controllerUnmigrated } = getStakingLedger(activeAddress)

  // Extract options from modal
  const { nominations, bondFor, bondAmount, nominees } = options || {}
  const isNominator = bondFor === 'nominator'

  const signingAccount = activeAddress

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
      return
    }

    try {
      // Format nominees properly with the expected structure
      const formattedNominees = (nominees || []).map((address: string) => ({
        type: 'Id',
        value: address,
      }))

      if (isNewNominator) {
        const txs = serviceApi.tx.newNominator(
          BigInt(bondAmount.toString()),
          { type: 'Stash' }, // Default payee
          formattedNominees
        )
        if (!txs || !txs.length) {
          return
        }
        // For new nominators, we need to bond and nominate
        return newBatchCall(txs, signingAccount)
      } else {
        // For existing nominators, just nominate
        return serviceApi.tx.stakingNominate(nominees || [])
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
    (isNominator && !controllerUnmigrated)

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
  if (isNominator && controllerUnmigrated) {
    warnings.push(t('controllerNotMigrated', { ns: 'modals' }))
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
        {...submitExtrinsic}
      />
    </>
  )
}
