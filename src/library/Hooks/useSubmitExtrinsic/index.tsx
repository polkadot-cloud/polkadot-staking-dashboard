// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { DappName } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { manualSigners } from 'contexts/Connect/Utils';
import { useExtensions } from 'contexts/Extensions';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useNotifications } from 'contexts/Notifications';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyApi, AnyJson } from 'types';
import { useBuildPayload } from '../useBuildPayload';
import { useProxySupported } from '../useProxySupported';
import type { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types';

export const useSubmitExtrinsic = ({
  tx,
  shouldSubmit,
  callbackSubmit,
  callbackInBlock,
  from,
}: UseSubmitExtrinsicProps): UseSubmitExtrinsic => {
  const { t } = useTranslation('library');
  const { api } = useApi();
  const { extensions } = useExtensions();
  const { addNotification } = useNotifications();
  const { isProxySupported } = useProxySupported(from);
  const { addPending, removePending } = useExtrinsics();
  const { buildPayload } = useBuildPayload();
  const { getAccount, requiresManualSign, activeProxy } = useConnect();
  const {
    setTxFees,
    incrementPayloadUid,
    getTxPayload,
    resetTxPayloads,
    setSender,
    txFees,
    getTxSignature,
    setTxSignature,
  } = useTxMeta();
  const { setIsExecuting, resetStatusCodes, resetFeedback } =
    useLedgerHardware();

  // If no account is provided, fallback to empty string
  let submitAddress: string = from || '';

  // Store whether the transaction is in progress.
  const [submitting, setSubmitting] = useState(false);

  // Store the uid of the extrinsic.
  const [uid] = useState<number>(incrementPayloadUid());

  // Store whether this tx is proxy supported.
  const [proxySupported, setProxySupported] = useState<boolean>(
    isProxySupported(tx)
  );

  // Track for one-shot transaction reset after submission.
  const didTxReset = useRef<boolean>(false);

  // If proxy account is active, wrap tx in a proxy call and set the sender to the proxy account.
  const wrapTxInProxy = () => {
    // if already wrapped, return.
    if (
      tx?.method.toHuman().section === 'proxy' &&
      tx?.method.toHuman().method === 'proxy'
    ) {
      return;
    }

    // If batch transaction, wrap each call in proxy. Else, just wrap in proxy.
    if (activeProxy && tx && proxySupported) {
      submitAddress = activeProxy;
      tx = api?.tx.proxy.proxy(
        {
          id: from,
        },
        null,
        tx
      );
    }
  };

  // Wrap tx with proxy on component render.
  wrapTxInProxy();

  // check if tx is proxy supported on tx change.
  useEffect(() => {
    setProxySupported(isProxySupported(tx));
  }, [tx?.toString()]);

  // calculate fee upon setup changes and initial render
  useEffect(() => {
    setSender(submitAddress);
    calculateEstimatedFee();
  }, [tx?.toString(), getTxSignature(), tx?.signature.toString()]);

  // recalculate transaction payload on tx change
  useEffect(() => {
    buildPayload(tx, submitAddress, uid);
  }, [tx?.toString(), tx?.method?.args?.calls?.toString()]);

  const calculateEstimatedFee = async () => {
    if (tx === null) {
      return;
    }
    // get payment info
    const { partialFee } = await tx.paymentInfo(submitAddress);
    const partialFeeBn = new BigNumber(partialFee.toString());

    // give tx fees to global useTxMeta context
    if (partialFeeBn.toString() !== txFees.toString()) {
      setTxFees(partialFeeBn);
    }
  };

  // submit extrinsic
  const onSubmit = async () => {
    if (
      submitting ||
      !shouldSubmit ||
      !api ||
      (requiresManualSign(submitAddress) && !getTxSignature())
    ) {
      return;
    }

    const account = getAccount(submitAddress);
    if (account === null) {
      return;
    }

    const accountNonce = (
      await api.rpc.system.accountNextIndex(submitAddress)
    ).toHuman();

    const { source } = account;

    // if `activeAccount` is imported from an extension, ensure it is enabled.
    if (!manualSigners.includes(source)) {
      const extension = extensions.find((e) => e.id === source);
      if (extension === undefined) {
        throw new Error(`${t('walletNotFound')}`);
      } else {
        // summons extension popup if not already connected.
        extension.enable(DappName);
      }
    }

    const onReady = () => {
      addPending(accountNonce);
      addNotification({
        title: t('pending'),
        subtitle: t('transactionInitiated'),
      });
      callbackSubmit();
    };

    const onInBlock = () => {
      setSubmitting(false);
      removePending(accountNonce);
      addNotification({
        title: t('inBlock'),
        subtitle: t('transactionInBlock'),
      });
      callbackInBlock();
    };

    const onFinalizedEvent = (method: string) => {
      if (method === 'ExtrinsicSuccess') {
        addNotification({
          title: t('finalized'),
          subtitle: t('transactionSuccessful'),
        });
      } else if (method === 'ExtrinsicFailed') {
        addNotification({
          title: t('failed'),
          subtitle: t('errorWithTransaction'),
        });
        setSubmitting(false);
        removePending(accountNonce);
      }
    };

    const resetTx = () => {
      resetTxPayloads();
      setTxSignature(null);
      setSubmitting(false);
    };

    const resetLedgerTx = () => {
      setIsExecuting(false);
      resetStatusCodes();
      resetFeedback();
    };
    const resetManualTx = () => {
      resetTx();
      resetLedgerTx();
    };

    const onError = (type?: string) => {
      resetTx();
      if (type === 'ledger') {
        resetLedgerTx();
      }
      removePending(accountNonce);
      addNotification({
        title: t('cancelled'),
        subtitle: t('transactionCancelled'),
      });
    };

    const handleStatus = (status: AnyApi) => {
      if (status.isReady) onReady();
      if (status.isInBlock) onInBlock();
    };

    const unsubEvents = ['ExtrinsicSuccess', 'ExtrinsicFailed'];

    // pre-submission state update
    setSubmitting(true);

    const txPayload: AnyJson = getTxPayload();
    const txSignature: AnyJson = getTxSignature();

    // handle signed transaction.
    if (getTxSignature()) {
      try {
        tx.addSignature(submitAddress, txSignature, txPayload);

        const unsub = await tx.send(({ status, events = [] }: AnyApi) => {
          if (!didTxReset.current) {
            didTxReset.current = true;
            resetManualTx();
          }

          handleStatus(status);
          if (status.isFinalized) {
            events.forEach(({ event: { method } }: AnyApi) => {
              onFinalizedEvent(method);
              if (unsubEvents?.includes(method)) unsub();
            });
          }
        });
      } catch (e) {
        onError(manualSigners.includes(source) ? source : 'default');
      }
    } else {
      // handle unsigned transaction.
      const { signer } = account;
      try {
        const unsub = await tx.signAndSend(
          submitAddress,
          { signer },
          ({ status, events = [] }: AnyApi) => {
            if (!didTxReset.current) {
              didTxReset.current = true;
              resetTx();
            }

            handleStatus(status);
            if (status.isFinalized) {
              events.forEach(({ event: { method } }: AnyApi) => {
                onFinalizedEvent(method);
                if (unsubEvents?.includes(method)) unsub();
              });
            }
          }
        );
      } catch (e) {
        onError('default');
      }
    }
  };

  return {
    uid,
    onSubmit,
    submitting,
    submitAddress,
    proxySupported,
  };
};
