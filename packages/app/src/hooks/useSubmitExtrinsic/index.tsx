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
import { compactU32 } from 'dedot/shape'
import type { InjectedSigner } from 'dedot/types'
import { concatU8a, hexToU8a } from 'dedot/utils'
import { useProxySupported } from 'hooks/useProxySupported'
import { signLedgerPayload } from 'library/Signers/LedgerSigner'
import { VaultSigner } from 'library/Signers/VaultSigner'
import type {
  VaultSignatureResult,
  VaultSignStatus,
} from 'library/Signers/VaultSigner/types'
import { SignPrompt } from 'library/SubmitTx/ManualSign/Vault/SignPrompt'
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
  const { serviceApi } = useApi()
  const { network } = useNetwork()
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
          const proxiedTx = serviceApi.tx.proxy(real, tx)
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

    const { specName, specVersion } = tx.client.runtimeVersion
    const ss58 = serviceApi.spec.ss58(specName)
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
      window.injectedWeb3[source].enable(DappName)
    }

    // Pre-submission state update
    TxSubmission.setUidSubmitted(uid, true)

    // Handle signed transaction
    let signer: InjectedSigner | undefined
    let encodedSig
    const handlers = {
      onReady,
      onInBlock,
      onFinalized,
      onFailed,
      onError,
    }

    if (requiresManualSign(from)) {
      const networkInfo = {
        decimals: units,
        tokenSymbol: unit,
        specName,
        specVersion,
        ss58,
      }

      const $Signature = serviceApi.codec.$Signature(specName)
      if (!$Signature) {
        onError('default')
        return
      }

      if (source === 'ledger') {
        const metadata = await serviceApi.signer.metadata(specName)
        const result = await signLedgerPayload(
          specName,
          from,
          serviceApi.signer.extraSignedExtension,
          tx,
          metadata || '0x',
          networkInfo,
          (account as HardwareAccount).index
        )
        if (result) {
          encodedSig = {
            address: from,
            signature: $Signature.tryDecode(result.signature),
            extra: result.data,
          }
        }
      }

      if (source === 'vault') {
        const extra = serviceApi.signer.extraSignedExtension(specName, from)
        if (!extra) {
          onError('default')
          return
        }
        await extra.init()
        const rawPayload = extra.toRawPayload(tx.callHex)
        const prefixedPayload = concatU8a(
          compactU32.encode(tx.callLength),
          hexToU8a(rawPayload.data)
        )
        const result = await new VaultSigner({
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
        }).sign(prefixedPayload)

        encodedSig = {
          address: from,
          signature: $Signature.tryDecode(result),
          extra: extra.data,
        }
      }

      if (source === 'wallet_connect') {
        const extra = serviceApi.signer.extraSignedExtension(specName, from)
        if (!extra) {
          onError('default')
          return
        }
        await extra.init()
        const payload = extra.toPayload(tx.callHex)
        const result = (await signWcTx(payload)).signature

        encodedSig = {
          address: from,
          signature: $Signature.tryDecode(result),
          extra: extra.data,
        }
      }
      // Custom signer
      //
      // Submit the transaction with the raw signature
      if (!encodedSig) {
        onError('default')
        return
      }
      TxSubmission.addSend(uid, tx, encodedSig, handlers)
    } else {
      // Extension signer
      //
      // Get the signer for this account and submit the transaction
      signer = getExtensionAccount(from)?.signer as InjectedSigner | undefined
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
