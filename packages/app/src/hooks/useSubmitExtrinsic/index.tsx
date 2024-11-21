// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DappName, ManualSigners } from 'consts';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import { useTxMeta } from 'contexts/TxMeta';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import type {
  UnsafeTx,
  UseSubmitExtrinsic,
  UseSubmitExtrinsicProps,
} from './types';
import { NotificationsController } from 'controllers/Notifications';
import { useExtensions } from '@w3ux/react-connect-kit';
import { useProxySupported } from 'hooks/useProxySupported';
import { ApiController } from 'controllers/Api';
import { useNetwork } from 'contexts/Network';
import { useBalances } from 'contexts/Balances';
import type { PolkadotSigner } from 'polkadot-api';
import { AccountId, InvalidTxError } from 'polkadot-api';
import { connectInjectedExtension } from 'polkadot-api/pjs-signer';
import { formatAccountSs58 } from '@w3ux/utils';
import { LedgerSigner } from 'library/Signers/LedgerSigner';
import { getLedgerApp } from 'contexts/LedgerHardware/Utils';
import type { LedgerAccount } from '@w3ux/react-connect-kit/types';
import { VaultSigner } from 'library/Signers/VaultSigner';
import { usePrompt } from 'contexts/Prompt';
import { SignPrompt } from 'library/SubmitTx/ManualSign/Vault/SignPrompt';

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
  const { getNonce } = useBalances();
  const { activeProxy } = useActiveAccounts();
  const { extensionsStatus } = useExtensions();
  const { isProxySupported } = useProxySupported();
  const { openPromptWith, closePrompt } = usePrompt();
  const { handleResetLedgerTask } = useLedgerHardware();
  const { addPendingNonce, removePendingNonce } = useTxMeta();
  const { getAccount, requiresManualSign } = useImportedAccounts();
  const { txFees, setTxFees, setSender, incrementPayloadUid } = useTxMeta();

  // Store given tx as a ref.
  const txRef = useRef<UnsafeTx>(tx);

  // Store given submit address as a ref.
  const fromRef = useRef<string>(from || '');

  // Store whether the transaction is in progress.
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Store the uid of the extrinsic.
  const [uid] = useState<number>(incrementPayloadUid());

  // Track for one-shot transaction reset after submission.
  const didTxReset = useRef<boolean>(false);

  // If proxy account is active, wrap tx in a proxy call and set the sender to the proxy account.
  const wrapTxIfActiveProxy = () => {
    const { pApi } = ApiController.get(network);

    // if already wrapped, update fromRef and return.
    if (
      txRef.current?.decodedCall.type === 'Proxy' &&
      txRef.current?.decodedCall.value.type === 'proxy'
    ) {
      if (activeProxy) {
        fromRef.current = activeProxy;
      }
      return;
    }

    if (
      pApi &&
      activeProxy &&
      txRef.current &&
      isProxySupported(txRef.current, fromRef.current)
    ) {
      // update submit address to active proxy account.
      fromRef.current = activeProxy;

      // Do not wrap batch transactions. Proxy calls should already be wrapping each tx within the
      // batch via `useBatchCall`.
      if (
        txRef.current?.decodedCall.type === 'Utility' &&
        txRef.current?.decodedCall.value.type === 'batch'
      ) {
        return;
      }

      // Not a batch transaction: wrap tx in proxy call.
      txRef.current = pApi.tx.Proxy.proxy({
        real: {
          type: 'Id',
          value: from,
        },
        forceProxyType: null,
        call: txRef.current.decodedCall,
      });
    }
  };

  // Calculate the estimated tx fee of the transaction.
  const calculateEstimatedFee = async () => {
    if (txRef.current === null) {
      return;
    }

    // get payment info
    const partialFee = (await txRef.current.getPaymentInfo(fromRef.current))
      .partial_fee;
    const partialFeeBn = new BigNumber(partialFee.toString());

    // give tx fees to global useTxMeta context
    if (partialFeeBn.toString() !== txFees.toString()) {
      setTxFees(partialFeeBn);
    }
  };

  // Extrinsic submission handler.
  const onSubmit = async () => {
    const account = getAccount(fromRef.current);
    if (account === null || submitting || !shouldSubmit) {
      return;
    }

    const nonce = String(getNonce(fromRef.current));
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
      addPendingNonce(nonce);
      NotificationsController.emit({
        title: t('pending'),
        subtitle: t('transactionInitiated'),
      });
      if (callbackSubmit && typeof callbackSubmit === 'function') {
        callbackSubmit();
      }
    };

    const onInBlock = () => {
      setSubmitting(false);
      removePendingNonce(nonce);
      NotificationsController.emit({
        title: t('inBlock'),
        subtitle: t('transactionInBlock'),
      });
      if (callbackInBlock && typeof callbackInBlock === 'function') {
        callbackInBlock();
      }
    };

    const onFinalizedEvent = () => {
      NotificationsController.emit({
        title: t('finalized'),
        subtitle: t('transactionSuccessful'),
      });
      setSubmitting(false);
      removePendingNonce(nonce);
    };

    const onFailedTx = () => {
      NotificationsController.emit({
        title: t('failed'),
        subtitle: t('errorWithTransaction'),
      });
      setSubmitting(false);
      removePendingNonce(nonce);
    };

    const resetTx = () => {
      setSubmitting(false);
    };

    const onError = (type?: string) => {
      resetTx();
      if (type === 'ledger') {
        handleResetLedgerTask();
      }
      removePendingNonce(nonce);
      NotificationsController.emit({
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

    // pre-submission state update
    setSubmitting(true);

    // handle signed transaction.
    let signer: PolkadotSigner | undefined;
    if (requiresManualSign(fromRef.current)) {
      const pubKey = AccountId().enc(fromRef.current);
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
              onComplete: (result: Uint8Array) => void,
              toSign: Uint8Array
            ) => {
              openPromptWith(
                <SignPrompt
                  submitAddress={fromRef.current}
                  onComplete={onComplete}
                  toSign={toSign}
                />,
                'small'
              );
            },
            closePrompt: () => closePrompt(),
          }).getPolkadotSigner(networkInfo);
          break;

        case 'wallet_connect':
          // TODO: Implement
          break;
      }
    } else {
      // Get the polkadot signer for this account.
      signer = (await connectInjectedExtension(source))
        .getAccounts()
        .find(
          (a) => a.address === formatAccountSs58(fromRef.current, 42)
        )?.polkadotSigner;
    }

    try {
      const sub = tx.signSubmitAndWatch(signer).subscribe({
        next: (result: { type: string }) => {
          const eventType = result?.type;

          if (!didTxReset.current) {
            didTxReset.current = true;
            resetTx();
          }
          handleStatus(eventType);
          if (eventType === 'finalized') {
            onFinalizedEvent();
            sub?.unsubscribe();
          }
        },
        error: (err: Error) => {
          if (err instanceof InvalidTxError) {
            onFailedTx();
          }
          sub?.unsubscribe();
        },
      });
    } catch (e) {
      onError('default');
    }
  };

  // Refresh state upon `tx` updates.
  useEffect(() => {
    // update txRef to latest tx.
    txRef.current = tx;
    // update submit address to latest from.
    fromRef.current = from || '';
    // wrap tx in proxy call if active proxy & proxy supported.
    wrapTxIfActiveProxy();
    // ensure sender is up to date.
    setSender(fromRef.current);
    // re-calculate estimated tx fee.
    calculateEstimatedFee();
  }, [tx?.toString(), tx?.method?.args?.calls?.toString(), from]);

  return {
    uid,
    onSubmit,
    submitting,
    submitAddress: fromRef.current,
    proxySupported: isProxySupported(txRef.current, fromRef.current),
  };
};
