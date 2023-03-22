// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { DappName } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import type { ExtensionInjected } from 'contexts/Extensions/types';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useNotifications } from 'contexts/Notifications';
import { useTxMeta } from 'contexts/TxMeta';
import { useEffect, useState } from 'react';
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
  const { getAccount, requiresManualSign } = useConnect();
  const { addNotification } = useNotifications();
  const { extensions } = useExtensions();
  const { addPending, removePending } = useExtrinsics();
  const {
    setTxFees,
    getTxPayload,
    setTxPayload,
    setSender,
    txFees,
    txSignature,
    setTxSignature,
  } = useTxMeta();

  // if null account is provided, fallback to empty string
  const submitAddress: string = from || '';

  // whether the transaction is in progress
  const [submitting, setSubmitting] = useState(false);

  // calculate fee upon setup changes and initial render
  useEffect(() => {
    setSender(from);
    calculateEstimatedFee();
  }, [tx?.toString(), txSignature, tx?.signature.toString()]);

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

  // get payload string of the transaction and commit it to txMeta.
  const getPayload = async () => {
    if (api && tx) {
      if (getTxPayload() === null) {
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
        const nonce = api.registry.createType(
          'Compact<Index>',
          tx.nonce.toNumber()
        );

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
        const raw = api.registry.createType('ExtrinsicPayload', payload, {
          version: payload.version,
        });

        setTxPayload(raw);
      }
    }
  };

  // submit extrinsic
  const onSubmit = async () => {
    if (
      submitting ||
      !shouldSubmit ||
      !api ||
      (requiresManualSign(from) && !txSignature)
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

    const onError = () => {
      setSubmitting(false);
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

    // handle signed transaction.
    if (txSignature) {
      try {
        tx.addSignature(submitAddress, txSignature, txPayload);

        const unsub = await tx.send(({ status, events = [] }: AnyApi) => {
          setTxSignature(null);
          handleStatus(status);

          if (status.isFinalized) {
            events.forEach(({ event: { method } }: AnyApi) => {
              onFinalizedEvent(method);
              if (unsubEvents.includes(method)) unsub();
            });
          }
        });
      } catch (e) {
        console.log(e);
        setTxSignature(null);
        onError();
      }
    } else {
      // handle unsigned transaction.
      const { signer } = account;
      try {
        const unsub = await tx.signAndSend(
          from,
          { signer },
          ({ status, events = [] }: AnyApi) => {
            handleStatus(status);
            if (status.isFinalized) {
              events.forEach(({ event: { method } }: AnyApi) => {
                onFinalizedEvent(method);
                if (unsubEvents.includes(method)) unsub();
              });
            }
          }
        );
      } catch (e) {
        onError();
      }
    }
  };

  return {
    onSubmit,
    submitting,
    getPayload,
  };
};
