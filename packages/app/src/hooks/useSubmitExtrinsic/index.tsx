// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useExtensions } from '@w3ux/react-connect-kit';
import type { LedgerAccount } from '@w3ux/react-connect-kit/types';
import { formatAccountSs58 } from '@w3ux/utils';
import { TxSubmission } from 'api/txSubmission';
import BigNumber from 'bignumber.js';
import { DappName, ManualSigners } from 'consts';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import { getLedgerApp } from 'contexts/LedgerHardware/Utils';
import { useNetwork } from 'contexts/Network';
import { usePrompt } from 'contexts/Prompt';
import { useTxMeta } from 'contexts/TxMeta';
import { useWalletConnect } from 'contexts/WalletConnect';
import { Apis } from 'controllers/Apis';
import { Notifications } from 'controllers/Notifications';
import { useProxySupported } from 'hooks/useProxySupported';
import { LedgerSigner } from 'library/Signers/LedgerSigner';
import { VaultSigner } from 'library/Signers/VaultSigner';
import type {
  VaultSignatureResult,
  VaultSignStatus,
} from 'library/Signers/VaultSigner/types';
import { SignPrompt } from 'library/SubmitTx/ManualSign/Vault/SignPrompt';
import type { PolkadotSigner } from 'polkadot-api';
import { AccountId, InvalidTxError } from 'polkadot-api';
import {
  connectInjectedExtension,
  getPolkadotSignerFromPjs,
} from 'polkadot-api/pjs-signer';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types';
export const useSubmitExtrinsic = ({
  tx,
  from,
  shouldSubmit,
  callbackSubmit,
  callbackInBlock,
}: UseSubmitExtrinsicProps): UseSubmitExtrinsic => {
  const { t } = useTranslation('library');
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { signWcTx } = useWalletConnect();
  const { activeProxy } = useActiveAccounts();
  const { extensionsStatus } = useExtensions();
  const { isProxySupported } = useProxySupported();
  const { openPromptWith, closePrompt } = usePrompt();
  const { txFees, setTxFees, setSender } = useTxMeta();
  const { handleResetLedgerTask } = useLedgerHardware();
  const { getAccount, requiresManualSign } = useImportedAccounts();

  // Store whether the transaction is in progress.
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Track for one-shot transaction reset after submission.
  const txSubmitted = useRef<boolean>(false);

  // Generate a UID for this transaction.
  const uid = TxSubmission.addUid();

  // If proxy account is active, wrap tx in a proxy call and set the sender to the proxy account.
  const wrapTxIfActiveProxy = () => {
    const api = Apis.getApi(network);

    // if already wrapped, update fromRef and return.
    if (
      tx?.decodedCall.type === 'Proxy' &&
      tx?.decodedCall.value.type === 'proxy'
    ) {
      if (activeProxy) {
        from = activeProxy;
      }
      return;
    }

    if (activeProxy && tx && isProxySupported(tx, from)) {
      // update submit address to active proxy account.
      from = activeProxy;

      // Do not wrap batch transactions. Proxy calls should already be wrapping each tx within the
      // batch via `useBatchCall`.
      if (
        tx?.decodedCall.type === 'Utility' &&
        tx?.decodedCall.value.type === 'batch'
      ) {
        return;
      }

      // Not a batch transaction: wrap tx in proxy call.
      tx = api.tx.Proxy.proxy({
        real: {
          type: 'Id',
          value: from || '',
        },
        force_proxy_type: undefined,
        call: tx.decodedCall,
      });
    }
  };

  // Calculate the estimated tx fee of the transaction.
  const calculateEstimatedFee = async () => {
    if (tx === null) {
      return;
    }

    // get payment info
    const partialFee = (await tx.getPaymentInfo(from)).partial_fee;
    const partialFeeBn = new BigNumber(partialFee.toString());

    // give tx fees to global useTxMeta context
    if (partialFeeBn.toString() !== txFees.toString()) {
      setTxFees(partialFeeBn);
    }
  };

  // Extrinsic submission handler.
  const onSubmit = async () => {
    if (from === null) {
      return;
    }
    const account = getAccount(from);
    if (account === null || submitting || !shouldSubmit) {
      return;
    }

    const { source } = account;
    const isManualSigner = ManualSigners.includes(source);

    // if `activeAccount` is imported from an extension, ensure it is enabled.
    if (!isManualSigner) {
      const isInstalled = Object.entries(extensionsStatus).find(
        ([id, status]) => id === source && status === 'connected'
      );

      if (!isInstalled) {
        throw new Error(`${t('walletNotFound')}`);
      }

      if (!window?.injectedWeb3?.[source]) {
        throw new Error(`${t('walletNotFound')}`);
      }

      // summons extension popup if not already connected.
      window.injectedWeb3[source].enable(DappName);
    }

    const onReady = () => {
      Notifications.emit({
        title: t('pending'),
        subtitle: t('transactionInitiated'),
      });
      if (callbackSubmit && typeof callbackSubmit === 'function') {
        callbackSubmit();
      }
    };

    const onInBlock = () => {
      TxSubmission.removeUid(uid);
      setSubmitting(false);
      Notifications.emit({
        title: t('inBlock'),
        subtitle: t('transactionInBlock'),
      });
      if (callbackInBlock && typeof callbackInBlock === 'function') {
        callbackInBlock();
      }
    };

    const onFinalizedEvent = () => {
      Notifications.emit({
        title: t('finalized'),
        subtitle: t('transactionSuccessful'),
      });
      setSubmitting(false);
    };

    const onFailedTx = (err: Error) => {
      TxSubmission.removeUid(uid);
      if (err instanceof InvalidTxError) {
        Notifications.emit({
          title: t('failed'),
          subtitle: t('errorWithTransaction'),
        });
      }
      setSubmitting(false);
    };

    const onError = (type?: string) => {
      TxSubmission.removeUid(uid);
      setSubmitting(false);
      if (type === 'ledger') {
        handleResetLedgerTask();
      }
      Notifications.emit({
        title: t('cancelled'),
        subtitle: t('transactionCancelled'),
      });
    };

    const handleStatus = (status: string) => {
      if (status === 'broadcasted') {
        onReady();
      }
      if (status === 'txBestBlocksState') {
        onInBlock();
      }
    };

    // Pre-submission state updates
    setSubmitting(true);
    TxSubmission.setUidProcessing(uid, true);

    // handle signed transaction.
    let signer: PolkadotSigner | undefined;
    if (requiresManualSign(from)) {
      const pubKey = AccountId().enc(from);
      const networkInfo = {
        decimals: units,
        tokenSymbol: unit,
      };

      switch (source) {
        case 'ledger':
          signer = await new LedgerSigner(
            pubKey,
            getLedgerApp(network).txMetadataChainId
          ).getPolkadotSigner(networkInfo, (account as LedgerAccount).index);
          break;

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
              );
            },
            closePrompt: () => closePrompt(),
            setSubmitting,
          }).getPolkadotSigner();
          break;

        case 'wallet_connect':
          signer = getPolkadotSignerFromPjs(
            from,
            signWcTx,
            // Signing bytes not currently being used.
            // FIXME: Can implement, albeit won't be used.
            async () => ({
              id: 0,
              signature: '0x',
            })
          );
          break;
      }
    } else {
      // Get the polkadot signer for this account.
      const signerAccount = (await connectInjectedExtension(source))
        .getAccounts()
        .find((a) => from && a.address === formatAccountSs58(from, 42));
      signer = signerAccount?.polkadotSigner;
    }

    try {
      const sub = tx.signSubmitAndWatch(signer).subscribe({
        next: (result: { type: string }) => {
          const eventType = result?.type;

          if (!txSubmitted.current) {
            txSubmitted.current = true;
            setSubmitting(false);
          }
          handleStatus(eventType);
          if (eventType === 'finalized') {
            onFinalizedEvent();
            sub?.unsubscribe();
          }
        },
        error: (err: Error) => {
          onFailedTx(err);
          sub?.unsubscribe();
        },
      });
    } catch (e) {
      onError('default');
    }
  };

  // Refresh state upon `tx` updates.
  useEffect(() => {
    // wrap tx in proxy call if active proxy & proxy supported.
    wrapTxIfActiveProxy();
    // ensure sender is up to date.
    setSender(from);
    // re-calculate estimated tx fee.
    calculateEstimatedFee();
  }, [tx?.decodedCall?.toString(), from]);

  return {
    uid,
    onSubmit,
    submitting,
    submitAddress: from,
    proxySupported: isProxySupported(tx, from),
  };
};
