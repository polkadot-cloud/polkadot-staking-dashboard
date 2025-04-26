// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useExtensionAccounts, useExtensions } from '@w3ux/react-connect-kit'
import type { HardwareAccount } from '@w3ux/types'
import { DappName, ManualSigners } from 'consts'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import { useNetwork } from 'contexts/Network'
import { usePrompt } from 'contexts/Prompt'
import { useWalletConnect } from 'contexts/WalletConnect'
import { Notifications } from 'controllers/Notifications'
import { TxSubmission } from 'controllers/TxSubmission'
import type { InjectedSigner } from 'dedot/types'
import { decodeAddress } from 'dedot/utils'
import { useProxySupported } from 'hooks/useProxySupported'
import { LedgerSigner } from 'library/Signers/LedgerSigner'
import { VaultSigner } from 'library/Signers/VaultSigner'
import type {
  VaultSignatureResult,
  VaultSignStatus,
} from 'library/Signers/VaultSigner/types'
import { SignPrompt } from 'library/SubmitTx/ManualSign/Vault/SignPrompt'
import type { PolkadotSigner } from 'polkadot-api'
import { getPolkadotSignerFromPjs } from 'polkadot-api/pjs-signer'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types'
export const useSubmitExtrinsic = ({
  tx,
  tag,
  from,
  shouldSubmit,
  callbackSubmit,
  callbackInBlock,
}: UseSubmitExtrinsicProps): UseSubmitExtrinsic => {
  const { t } = useTranslation('app')
  const { network } = useNetwork()
  const { serviceApi } = useApi()
  const { signWcTx } = useWalletConnect()
  const { getAccountBalance } = useBalances()
  const { activeProxy } = useActiveAccounts()
  const { extensionsStatus } = useExtensions()
  const { isProxySupported } = useProxySupported()
  const { openPromptWith, closePrompt } = usePrompt()
  const { handleResetLedgerTask } = useLedgerHardware()
  const { getExtensionAccount } = useExtensionAccounts()
  const { getAccount, requiresManualSign } = useImportedAccounts()
  const { unit, units } = getNetworkData(network)

  // Store the uid for this transaction.
  const [uid, setUid] = useState<number>(0)

  // If proxy account is active, wrap tx in a proxy call and set the sender to the proxy account. If
  // already wrapped, update `from` address and return
  if (tx) {
    if (tx.call.pallet === 'Proxy' && tx.call.palletCall.name === 'Proxy') {
      if (activeProxy) {
        from = activeProxy.address
      }
    } else {
      if (activeProxy && isProxySupported(tx, from)) {
        // Update submit address to active proxy account
        const real = from
        from = activeProxy.address

        // Check not a batch transactions
        if (
          real &&
          !(tx.call.pallet === 'Utility' && tx.call.palletCall.name === 'Batch')
        ) {
          // Not a batch transaction: wrap tx in proxy call. Proxy calls should already be wrapping
          // each tx within the batch via `useBatchCall`
          const proxiedTx = serviceApi.tx.proxy(real, tx.call)
          if (proxiedTx) {
            tx = proxiedTx
          }
        }
      }
    }
  }

  // Extrinsic submission handler
  const onSubmit = async () => {
    if (!tx || TxSubmission.getUid(uid)?.submitted) {
      return
    }
    if (from === null) {
      return
    }
    const account = getAccount(from)
    if (account === null || !shouldSubmit) {
      return
    }

    const { source } = account
    const isManualSigner = ManualSigners.includes(source)

    // If `activeAccount` is imported from an extension, ensure it is enabled
    if (!isManualSigner) {
      const isInstalled = Object.entries(extensionsStatus).find(
        ([id, status]) => id === source && status === 'connected'
      )
      if (!isInstalled || !window?.injectedWeb3?.[source]) {
        throw new Error(`${t('walletNotFound')}`)
      }
      // NOTE: Summons extension popup if not already connected
      // TODO: Expose this in a w3ux utility
      window.injectedWeb3[source].enable(DappName)
    }

    // Pre-submission state update
    TxSubmission.setUidSubmitted(uid, true)

    // Handle signed transaction
    let signer: PolkadotSigner | undefined
    const handlers = {
      onReady,
      onInBlock,
      onFinalized,
      onFailed,
      onError,
    }

    if (requiresManualSign(from)) {
      const pubKey = decodeAddress(from)
      const networkInfo = {
        decimals: units,
        tokenSymbol: unit,
      }
      switch (source) {
        case 'ledger':
          signer = await new LedgerSigner(pubKey).getPolkadotSigner(
            networkInfo,
            (account as HardwareAccount).index
          )
          break

        case 'vault':
          signer = await new VaultSigner(pubKey, {
            openPrompt: (
              onComplete: (
                status: VaultSignStatus,
                result: VaultSignatureResult
              ) => void,
              toSign: Uint8Array
            ) => {
              openPromptWith(
                <SignPrompt
                  submitAddress={from}
                  onComplete={onComplete}
                  toSign={toSign}
                />,
                'sm',
                false
              )
            },
            closePrompt: () => closePrompt(),
            setSubmitting: (val: boolean) =>
              TxSubmission.setUidSubmitted(uid, val),
          }).getPolkadotSigner()
          break

        case 'wallet_connect':
          // TODO: Replace with dedot utility
          // Pass `extra` payload into signWcTx (as signPayload) to generate signature
          signer = getPolkadotSignerFromPjs(
            from,
            signWcTx,
            // Signing bytes not currently being used
            // FIXME: Can implement, albeit won't be used
            async () => ({
              id: 0,
              signature: '0x',
            })
          )
          break
      }

      // Submit the transaction
      // TODO: Use `addSend` for instead
      TxSubmission.addSignAndSend(
        uid,
        from,
        tx,
        signer as InjectedSigner,
        getAccountBalance(from).nonce + TxSubmission.pendingTxCount(from),
        handlers
      )
    } else {
      // Extension signer
      //
      // Get the signer for this account and submit the transaction
      signer = getExtensionAccount(from)?.signer as PolkadotSigner | undefined
      if (!signer) {
        onError('default')
        return
      }
      TxSubmission.addSignAndSend(
        uid,
        from,
        tx,
        signer as InjectedSigner,
        getAccountBalance(from).nonce + TxSubmission.pendingTxCount(from),
        handlers
      )
    }
  }

  // Initialise tx submission
  useEffect(() => {
    // Add a new uid for this transaction
    if (uid === 0) {
      const newUid = TxSubmission.addUid({ from, tag })
      setUid(newUid)
    }
  }, [])

  const onReady = () => {
    Notifications.emit({
      title: t('pending'),
      subtitle: t('transactionInitiated'),
    })
    if (callbackSubmit && typeof callbackSubmit === 'function') {
      callbackSubmit()
    }
  }

  const onInBlock = () => {
    Notifications.emit({
      title: t('inBlock'),
      subtitle: t('transactionInBlock'),
    })
    if (callbackInBlock && typeof callbackInBlock === 'function') {
      callbackInBlock()
    }
  }

  const onFinalized = () => {
    Notifications.emit({
      title: t('finalized'),
      subtitle: t('transactionSuccessful'),
    })
  }

  const onFailed = () => {
    Notifications.emit({
      title: t('failed'),
      subtitle: t('errorWithTransaction'),
    })
  }

  const onError = (type?: string) => {
    if (type === 'ledger') {
      handleResetLedgerTask()
    }
    Notifications.emit({
      title: t('cancelled'),
      subtitle: t('transactionCancelled'),
    })
  }

  // Re-fetch tx fee if tx changes
  const fetchTxFee = async () => {
    if (tx && from) {
      const { partialFee } = await tx.paymentInfo(from)
      TxSubmission.updateFee(uid, partialFee)
    }
  }
  useEffect(() => {
    if (uid > 0) {
      fetchTxFee()
    }
  }, [uid, JSON.stringify(tx?.toHex())])

  return {
    uid,
    onSubmit,
    submitAddress: from,
    proxySupported: isProxySupported(tx, from),
  }
}
