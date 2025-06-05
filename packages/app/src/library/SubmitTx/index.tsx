// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useTxMeta } from 'contexts/TxMeta'
import { Tx } from 'library/Tx'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { Default } from './Default'
import { ManualSign } from './ManualSign'
import type { SubmitTxProps } from './types'

export const SubmitTx = ({
  uid,
  onSubmit,
  submitText,
  buttons = [],
  submitAddress,
  valid = false,
  noMargin = false,
  proxySupported,
  displayFor = 'default',
  requiresMigratedController = false,
  onResize,
  transparent,
}: SubmitTxProps) => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const { getTxSubmission } = useTxMeta()
  const { setModalResize } = useOverlay().modal
  const { getTransferOptions } = useTransferOptions()
  const { activeAddress, activeProxy } = useActiveAccounts()
  const { getAccount, requiresManualSign } = useImportedAccounts()

  const { unit } = getStakingChainData(network)
  const txSubmission = getTxSubmission(uid)
  const from = txSubmission?.from || null
  const fee = txSubmission?.fee || 0n
  const submitted = txSubmission?.submitted || false
  const { transferrableBalance } = getTransferOptions(from)
  const notEnoughFunds = transferrableBalance - fee < 0n && fee > 0n

  // Default to active account
  let signingOpts = {
    label: t('signer', { ns: 'app' }),
    who: getAccount(activeAddress),
  }

  if (activeProxy && proxySupported) {
    signingOpts = {
      label: t('signedByProxy', { ns: 'app' }),
      who: getAccount(activeProxy.address),
    }
  } else if (!(activeProxy && proxySupported) && requiresMigratedController) {
    signingOpts = {
      label: t('signedByController', { ns: 'app' }),
      who: getAccount(activeAddress),
    }
  }

  submitText =
    submitText ||
    `${
      submitted
        ? t('submitting', { ns: 'modals' })
        : t('submit', { ns: 'modals' })
    }`

  // Set resize on submit footer UI height changes
  useEffect(() => {
    setModalResize()
    if (onResize) {
      onResize()
    }
  }, [notEnoughFunds, requiresMigratedController])

  return (
    <Tx
      displayFor={displayFor}
      margin={!noMargin}
      label={signingOpts.label}
      name={signingOpts.who?.name || ''}
      notEnoughFunds={notEnoughFunds}
      dangerMessage={`${t('notEnough', { ns: 'app' })} ${unit}`}
      transparent={transparent}
      SignerComponent={
        requiresManualSign(from) ? (
          <ManualSign
            uid={uid}
            onSubmit={onSubmit}
            submitted={submitted}
            valid={valid}
            submitText={submitText}
            buttons={buttons}
            submitAddress={submitAddress}
            displayFor={displayFor}
            notEnoughFunds={notEnoughFunds}
          />
        ) : (
          <Default
            uid={uid}
            onSubmit={onSubmit}
            submitted={submitted}
            valid={valid}
            submitText={submitText}
            buttons={buttons}
            submitAddress={submitAddress}
            displayFor={displayFor}
            notEnoughFunds={notEnoughFunds}
          />
        )
      }
    />
  )
}
