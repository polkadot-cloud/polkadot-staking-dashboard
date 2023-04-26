// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignClient } from '@walletconnect/sign-client/dist/types/client';
import type { SessionTypes } from '@walletconnect/types';
import BigNumber from 'bignumber.js';
import { isSupportedProxyCall } from 'config/proxies';
import { DappName } from 'consts';
import { useBalances } from 'contexts/Accounts/Balances';
import { useProxies } from 'contexts/Accounts/Proxies';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import type { ExtensionInjected } from 'contexts/Extensions/types';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useNotifications } from 'contexts/Notifications';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyApi, AnyJson } from 'types';
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
  const {
    getAccount,
    requiresManualSign,
    getWalletConnectClient,
    getWalletConnectSession,
    getWalletConnectChainInfo,
    activeAccount, 
    activeProxy
  } = useConnect();
  const { addNotification } = useNotifications();
  const { extensions } = useExtensions();
  const { addPending, removePending } = useExtrinsics();
  const { getAccount: getBalanceAccount } = useBalances();
  const { getProxyDelegate } = useProxies();
  const {
    setTxFees,
    incrementPayloadUid,
    getTxPayload,
    setTxPayload,
    resetTxPayloads,
    setSender,
    txFees,
    getTxSignature,
    setTxSignature,
  } = useTxMeta();
  const { setIsExecuting, resetStatusCodes, resetFeedback } =
    useLedgerHardware();

  // if null account is provided, fallback to empty string
  let submitAddress: string = from || '';

  // whether the transaction is in progress
  const [submitting, setSubmitting] = useState(false);

  // store the uid of the extrinsic
  const [uid] = useState<number>(incrementPayloadUid());

  // store whether this call is proxy sypported.
  const getProxySupported = () => {
    // if already wrapped, return.
    if (
      tx?.method.toHuman().section === 'proxy' &&
      tx?.method.toHuman().method === 'proxy'
    ) {
      return true;
    }
    // Ledger devices do not support nesting on `proxy.proxy` calls.
    if (getAccount(activeProxy)?.source === 'ledger') {
      return false;
    }

    const proxyDelegate = getProxyDelegate(activeAccount, activeProxy);
    const proxyType = proxyDelegate?.proxyType || '';
    const pallet = tx?.method.toHuman().section;
    const method = tx?.method.toHuman().method;
    const call = `${pallet}.${method}`;

    // If a batch call, test if every inner call is a supported proxy call.
    if (call === 'utility.batch') {
      return (tx?.method?.toHuman()?.args?.calls || [])
        .map((c: AnyJson) => ({
          pallet: c.section,
          method: c.method,
        }))
        .every((c: AnyJson) =>
          isSupportedProxyCall(proxyType, c.pallet, c.method)
        );
    }

    // Check if the current call is a supported proxy call.
    return isSupportedProxyCall(proxyType, pallet, method);
  };

  const [proxySupported, setProxySupported] = useState<boolean>(
    getProxySupported()
  );
  useEffect(() => {
    setProxySupported(getProxySupported());
  }, [tx?.toString()]);

  // track for one-shot transaction reset after submission.
  const didTxReset = useRef<boolean>(false);

  // the unsigned payload used when signing with wallet-connect
  const [unsignedPayload, setUnsignedPayload] = useState<AnyJson | null>(null);
  // If proxy account is active, wrap tx in a proxy call and set the sender to the proxy account.
  const wrapTxInProxy = () => {
    // if already wrapped, return.
    if (
      tx?.method.toHuman().section === 'proxy' &&
      tx?.method.toHuman().method === 'proxy'
    ) {
      return;
    }
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

  // Wrap tx with proxy on component mount.
  wrapTxInProxy();

  // calculate fee upon setup changes and initial render
  useEffect(() => {
    setSender(submitAddress);
    calculateEstimatedFee();
  }, [tx?.toString(), getTxSignature(), tx?.signature.toString()]);

  // recalculate transaction payload on tx change
  useEffect(() => {
    wrapTxInProxy();
    buildPayload();
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

  // build and set payload of the transaction and store it in TxMetaContext.
  const buildPayload = async () => {
    if (api && tx) {
      const lastHeader = await api.rpc.chain.getHeader();
      const blockNumber = api.registry.createType(
        'BlockNumber',
        lastHeader.number.toNumber()
      );
      const method = api.createType('Call', tx);
      const era = api.registry.createType('ExtrinsicEra', {
        current: lastHeader.number.toNumber(),
        period: 64,
      });

      const accountNonce = getBalanceAccount(submitAddress)?.nonce || 0;
      const nonce = api.registry.createType('Compact<Index>', accountNonce);

      const payload = {
        specVersion: api.runtimeVersion.specVersion.toHex(),
        transactionVersion: api.runtimeVersion.transactionVersion.toHex(),
        address: submitAddress,
        blockHash: lastHeader.hash.toHex(),
        blockNumber: blockNumber.toHex(),
        era: era.toHex(),
        genesisHash: api.genesisHash.toHex(),
        method: method.toHex(),
        nonce: nonce.toHex(),
        signedExtensions: [
          'CheckNonZeroSender',
          'CheckSpecVersion',
          'CheckTxVersion',
          'CheckGenesis',
          'CheckMortality',
          'CheckNonce',
          'CheckWeight',
          'ChargeTransactionPayment',
        ],
        tip: api.registry.createType('Compact<Balance>', 0).toHex(),
        version: tx.version,
      };
      setUnsignedPayload(payload);

      const raw = api.registry.createType('ExtrinsicPayload', payload, {
        version: payload.version,
      });
      setTxPayload(raw, uid);
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
    if (source !== 'ledger') {
      const extension = extensions.find(
        (e: ExtensionInjected) => e.id === source
      );
      if (extension === undefined) {
        throw new Error(`${t('walletNotFound')}`);
      } else if (source !== 'wallet-connect') {
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

    const onError = (type?: 'default' | 'ledger') => {
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
      addPending(accountNonce);
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
        removePending(accountNonce);
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
        onError('ledger');
      }
    } else if (source === 'wallet-connect') {
      const wcSignClient: SignClient | null = getWalletConnectClient();
      const wcSession: SessionTypes.Struct | null = getWalletConnectSession();
      const wcChainInfo: string | null = getWalletConnectChainInfo();

      try {
        const result = await sendWalletConnectTx(
          wcChainInfo as string,
          submitAddress,
          wcSignClient as SignClient,
          wcSession as SessionTypes.Struct,
          unsignedPayload as AnyJson
        );
        tx.addSignature(submitAddress, result.signature, getTxPayload());

        const unsub = await tx.send(({ status, events = [] }: AnyApi) => {
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
        });
      } catch (e) {
        onError('default');
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
    proxySupported,
  };
};
