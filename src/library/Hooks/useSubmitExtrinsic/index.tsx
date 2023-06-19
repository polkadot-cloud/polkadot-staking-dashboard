// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignClient } from '@walletconnect/sign-client/dist/types/client';
import type { SessionTypes } from '@walletconnect/types';
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
  const { isProxySupported } = useProxySupported();
  const { addPending, removePending } = useExtrinsics();
  const { buildPayload } = useBuildPayload();
  const {
    getAccount,
    requiresManualSign,
    getWalletConnectClient,
    getWalletConnectSession,
    getWalletConnectChainInfo,
    activeProxy,
  } = useConnect();
  const {
    setTxFees,
    incrementPayloadUid,
    getTxPayload,
    resetTxPayloads,
    setSender,
    txFees,
    getTxSignature,
    setTxSignature,
    getUnsignedPayload,
  } = useTxMeta();
  const { setIsExecuting, resetStatusCodes, resetFeedback } =
    useLedgerHardware();

  // Store given tx as a ref.
  const txRef = useRef<AnyApi>(tx);

  // Store given submit address as a ref.
  const fromRef = useRef<string>(from || '');

  // Store whether the transaction is in progress.
  const [submitting, setSubmitting] = useState(false);

  // Store the uid of the extrinsic.
  const [uid] = useState<number>(incrementPayloadUid());

  // Store whether this tx is proxy supported.
  const [proxySupported, setProxySupported] = useState<boolean>(
    isProxySupported(txRef.current, fromRef.current)
  );

  // Track for one-shot transaction reset after submission.
  const didTxReset = useRef<boolean>(false);

  // If proxy account is active, wrap tx in a proxy call and set the sender to the proxy account.
  const wrapTxIfActiveProxy = () => {
    // if already wrapped, update fromRef and return.
    if (
      txRef.current?.method.toHuman().section === 'proxy' &&
      txRef.current?.method.toHuman().method === 'proxy'
    ) {
      if (activeProxy) {
        fromRef.current = activeProxy;
      }
      return;
    }

    // Handle proxy supported.
    if (api && activeProxy && txRef.current && proxySupported) {
      // update submit address to active proxy account.
      fromRef.current = activeProxy;

      // Do not wrap batch transactions. Proxy calls should already be wrapping each tx within the
      // batch via `useBatchCall`.
      if (
        txRef.current?.method.toHuman().section === 'utility' &&
        txRef.current?.method.toHuman().method === 'batch'
      ) {
        return;
      }

      // Not a batch transaction: wrap tx in proxy call.
      txRef.current = api.tx.proxy.proxy(
        {
          id: from,
        },
        null,
        txRef.current
      );
    }
  };

  // Calculate the estimated tx fee of the transaction.
  const calculateEstimatedFee = async () => {
    if (txRef.current === null) {
      return;
    }
    // get payment info
    const { partialFee } = await txRef.current.paymentInfo(fromRef.current);
    const partialFeeBn = new BigNumber(partialFee.toString());

    // give tx fees to global useTxMeta context
    if (partialFeeBn.toString() !== txFees.toString()) {
      setTxFees(partialFeeBn);
    }
  };

  // Refresh state upon `tx` updates.
  useEffect(() => {
    // update txRef to latest tx.
    txRef.current = tx;
    // update submit address to latest from.
    fromRef.current = from || '';
    // update proxy supported status.
    setProxySupported(isProxySupported(txRef.current, fromRef.current));
    // wrap tx in proxy call if active proxy & proxy supported.
    wrapTxIfActiveProxy();
    // ensure sender is up to date.
    setSender(fromRef.current);
    // re-calculate estimated tx fee.
    calculateEstimatedFee();
    // rebuild tx payload.
    buildPayload(txRef.current, fromRef.current, uid);
  }, [tx?.toString(), tx?.method?.args?.calls?.toString(), from]);

  // Extrinsic submission handler.
  const onSubmit = async () => {
    const account = getAccount(fromRef.current);
    if (
      account === null ||
      submitting ||
      !shouldSubmit ||
      !api ||
      (requiresManualSign(fromRef.current) && !getTxSignature())
    ) {
      return;
    }

    const nonce = (
      await api.rpc.system.accountNextIndex(fromRef.current)
    ).toHuman();

    const { source } = account;

    // if `activeAccount` is imported from an extension, ensure it is enabled.
    if (!manualSigners.includes(source)) {
      const extension = extensions.find((e) => e.id === source);
      if (extension === undefined) {
        throw new Error(`${t('walletNotFound')}`);
      } else if (source !== 'wallet-connect') {
        // summons extension popup if not already connected.
        extension.enable(DappName);
      }
    }

    const onReady = () => {
      addPending(nonce);
      addNotification({
        title: t('pending'),
        subtitle: t('transactionInitiated'),
      });
      callbackSubmit();
    };

    const onInBlock = () => {
      setSubmitting(false);
      removePending(nonce);
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
        removePending(nonce);
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
      removePending(nonce);
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
    const unsignedPayload: AnyJson = getUnsignedPayload();

    interface IFormattedRpcResponse {
      method?: string;
      address?: string;
      valid: boolean;
      signature: any;
    }

    const sendWalletConnectTx = async (
      chainId: string,
      fromAddress: string,
      client: SignClient,
      session: SessionTypes.Struct,
      payload: AnyJson
    ): Promise<IFormattedRpcResponse> => {
      setSubmitting(true);
      addPending(nonce);
      addNotification({
        title: t('pending'),
        subtitle: t('transactionInitiated'),
      });
      try {
        const result = await client.request<{
          signature: string;
        }>({
          chainId,
          topic: session.topic,
          request: {
            method: 'polkadot_signTransaction',
            params: {
              address: fromAddress,
              transactionPayload: payload,
            },
          },
        });

        return {
          method: 'polkadot_signTransaction',
          address: fromAddress,
          valid: true,
          signature: result.signature,
        };
      } catch (error: any) {
        setSubmitting(false);
        removePending(nonce);
        addNotification({
          title: t('cancelled'),
          subtitle: t('transactionCancelled'),
        });
        return {
          method: 'polkadot_signTransaction',
          address: fromAddress,
          valid: false,
          signature: '',
        };
      }
    };

    // handle signed transaction.
    if (getTxSignature()) {
      try {
        txRef.current.addSignature(fromRef.current, txSignature, txPayload);

        const unsub = await txRef.current.send(
          ({ status, events = [] }: AnyApi) => {
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
          }
        );
      } catch (e) {
        onError(manualSigners.includes(source) ? source : 'default');
      }
    } else if (source === 'wallet-connect') {
      const wcSignClient: SignClient | null = getWalletConnectClient();
      const wcSession: SessionTypes.Struct | null = getWalletConnectSession();
      const wcChainInfo: string | null = getWalletConnectChainInfo();

      try {
        const result = await sendWalletConnectTx(
          wcChainInfo as string,
          fromRef.current,
          wcSignClient as SignClient,
          wcSession as SessionTypes.Struct,
          unsignedPayload as AnyJson
        );
        txRef.current.addSignature(
          fromRef.current,
          result.signature,
          txPayload
        );

        const unsub = await txRef.current.send(
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
    } else {
      // handle unsigned transaction.
      const { signer } = account;
      try {
        const unsub = await txRef.current.signAndSend(
          fromRef.current,
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
    submitAddress: fromRef.current,
    proxySupported,
  };
};
