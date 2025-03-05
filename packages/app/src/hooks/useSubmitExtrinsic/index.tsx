// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useExtensions } from '@w3ux/react-connect-kit'
import type { LedgerAccount } from '@w3ux/types'
import { formatAccountSs58 } from '@w3ux/utils'
import { Proxy } from 'api/tx/proxy'
import { TxSubmission } from 'api/txSubmission'
import { DappName, ManualSigners } from 'consts'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import { getLedgerApp } from 'contexts/LedgerHardware/Utils'
import { useNetwork } from 'contexts/Network'
import { usePrompt } from 'contexts/Prompt'
import { useWalletConnect } from 'contexts/WalletConnect'
import { Notifications } from 'controllers/Notifications'
import { useProxySupported } from 'hooks/useProxySupported'
import { LedgerSigner } from 'library/Signers/LedgerSigner'
import { VaultSigner } from 'library/Signers/VaultSigner'
import type {
  VaultSignatureResult,
  VaultSignStatus,
} from 'library/Signers/VaultSigner/types'
import { SignPrompt } from 'library/SubmitTx/ManualSign/Vault/SignPrompt'
import type { PolkadotSigner } from 'polkadot-api'
import { AccountId, InvalidTxError } from 'polkadot-api'
import {
  connectInjectedExtension,
  getPolkadotSignerFromPjs,
} from 'polkadot-api/pjs-signer'
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
  const {
    network,
    networkData: { units, unit },
  } = useNetwork()
  const { getNonce } = useBalances()
  const { signWcTx } = useWalletConnect()
  const { activeProxy } = useActiveAccounts()
  const { extensionsStatus } = useExtensions()
  const { isProxySupported } = useProxySupported()
  const { openPromptWith, closePrompt } = usePrompt()
  const { handleResetLedgerTask } = useLedgerHardware()
  const { getAccount, requiresManualSign } = useImportedAccounts()

  // Store the uid for this transaction.
  const [uid, setUid] = useState<number>(0)

  // If proxy account is active, wrap tx in a proxy call and set the sender to the proxy account. If
  // already wrapped, update `from` address and return
  if (tx) {
    if (
      tx.decodedCall?.type === 'Proxy' &&
      tx.decodedCall?.value?.type === 'proxy'
    ) {
      if (activeProxy) {
        from = activeProxy
      }
    } else {
      if (activeProxy && isProxySupported(tx, from)) {
        // Update submit address to active proxy account
        const real = from
        from = activeProxy

        // Check not a batch transactions
        if (
          real &&
          !(
            tx.decodedCall?.type === 'Utility' &&
            tx.decodedCall?.value.type === 'batch'
          )
        ) {
          // Not a batch transaction: wrap tx in proxy call. Proxy calls should already be wrapping
          // each tx within the batch via `useBatchCall`
          tx = new Proxy(network, real, tx).tx()
        }
      }
    }
  }

  // Extrinsic submission handler.
  const onSubmit = async () => {
    if (TxSubmission.getUid(uid)?.submitted) {
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

    // if `activeAccount` is imported from an extension, ensure it is enabled
    if (!isManualSigner) {
      const isInstalled = Object.entries(extensionsStatus).find(
        ([id, status]) => id === source && status === 'connected'
      )
      if (!isInstalled || !window?.injectedWeb3?.[source]) {
        throw new Error(`${t('walletNotFound')}`)
      }
      // summons extension popup if not already connected
      window.injectedWeb3[source].enable(DappName)
    }

    // Pre-submission state updates
    TxSubmission.setUidSubmitted(uid, true)

    // Handle signed transaction
    let signer: PolkadotSigner | undefined
    if (requiresManualSign(from)) {
      const pubKey = AccountId().enc(from)
      const networkInfo = {
        decimals: units,
        tokenSymbol: unit,
      }
      switch (source) {
        case 'ledger':
          signer = await new LedgerSigner(
            pubKey,
            getLedgerApp(network).txMetadataChainId
          ).getPolkadotSigner(networkInfo, (account as LedgerAccount).index)
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
                'small',
                false
              )
            },
            closePrompt: () => closePrompt(),
            setSubmitting: (val: boolean) =>
              TxSubmission.setUidSubmitted(uid, val),
          }).getPolkadotSigner()
          break

        case 'wallet_connect':
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
    } else {
      // Get the polkadot signer for this account
      const signerAccount = (await connectInjectedExtension(source))
        .getAccounts()
        .find((a) => from && a.address === formatAccountSs58(from, 42))
      signer = signerAccount?.polkadotSigner
    }

    if (!signer) {
      onError('default')
      return
    }

    // Calculate correct nonce
    const nonce = getNonce(from) + TxSubmission.pendingTxCount(from)

    // Submit the transaction
    TxSubmission.addSub(uid, tx, signer, nonce, {
      onReady,
      onInBlock,
      onFinalized,
      onFailed,
      onError,
    })
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

  const onFailed = (err: Error) => {
    if (err instanceof InvalidTxError) {
      Notifications.emit({
        title: t('failed'),
        subtitle: t('errorWithTransaction'),
      })
    }
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
    if (tx) {
      const partial_fee = (await tx?.getPaymentInfo(from))?.partial_fee || 0n
      TxSubmission.updateFee(uid, partial_fee)
    }
  }
  useEffect(() => {
    if (uid > 0) {
      fetchTxFee()
    }
  }, [
    uid,
    JSON.stringify(tx?.decodedCall, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ),
  ])

  return {
    uid,
    onSubmit,
    submitAddress: from,
    proxySupported: isProxySupported(tx, from),
  }
}
