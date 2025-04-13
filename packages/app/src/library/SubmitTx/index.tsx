// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useBonded } from 'contexts/Bonded'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
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
  fromController = false,
  onResize,
  transparent,
}: SubmitTxProps) => {
  const { t } = useTranslation()
  const { getBondedAccount } = useBonded()
  const {
    consts: { existentialDeposit },
  } = useApi()
  const { getTxSubmission } = useTxMeta()
  const { network } = useNetwork()
  const { setModalResize } = useOverlay().modal
  const { getBalance, getEdReserved } = useBalances()
  const { activeAddress, activeProxy } = useActiveAccounts()
  const { getAccount, requiresManualSign } = useImportedAccounts()

  const { unit } = getNetworkData(network)
  const controller = getBondedAccount(activeAddress)
  const txSubmission = getTxSubmission(uid)
  const from = txSubmission?.from || null
  const fee = txSubmission?.fee || 0n
  const submitted = txSubmission?.submitted || false

  const edReserved = getEdReserved(from, existentialDeposit)
  const { free, frozen } = getBalance(from)
  const balanceforTxFees = free.minus(edReserved).minus(frozen)
  const notEnoughFunds =
    balanceforTxFees.minus(fee.toString()).isLessThan(0) && fee > 0n

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
  } else if (!(activeProxy && proxySupported) && fromController) {
    signingOpts = {
      label: t('signedByController', { ns: 'app' }),
      who: getAccount(controller),
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
  }, [notEnoughFunds, fromController])

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
