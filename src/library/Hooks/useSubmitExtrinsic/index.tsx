// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { DappName } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { Extension } from 'contexts/Connect/types';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useNotifications } from 'contexts/Notifications';
import { useTxFees } from 'contexts/TxFees';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi } from 'types';
import { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types';

export const useSubmitExtrinsic = (
  extrinsic: UseSubmitExtrinsicProps
): UseSubmitExtrinsic => {
  // extract extrinsic info
  const { tx, shouldSubmit, callbackSubmit, callbackInBlock } = extrinsic;

  // if null account is provided, fallback to empty string
  const { from } = extrinsic;
  const submitAddress: string = from ?? '';

  const { api } = useApi();
  const { setTxFees, setSender, txFees } = useTxFees();
  const { addNotification } = useNotifications();
  const { addPending, removePending } = useExtrinsics();
  const { getAccount, extensions } = useConnect();
  const { t } = useTranslation('common');

  // whether the transaction is in progress
  const [submitting, setSubmitting] = useState(false);

  // calculate fee upon setup changes and initial render
  useEffect(() => {
    setSender(from);
    calculateEstimatedFee();
  }, [tx]);

  const calculateEstimatedFee = async () => {
    if (tx === null) {
      return;
    }
    // get payment info
    const { partialFee } = await tx.paymentInfo(submitAddress);
    const partialFeeBn = new BN(partialFee.toString());

    // give tx fees to global useTxFees context
    if (partialFeeBn.toString() !== txFees.toString()) {
      setTxFees(partialFeeBn);
    }
  };

  // submit extrinsic
  const submitTx = async () => {
    if (submitting || !shouldSubmit || !api) {
      return;
    }
    const account = getAccount(submitAddress);
    if (account === null) {
      return;
    }

    const _accountNonce = await api.rpc.system.accountNextIndex(submitAddress);
    const accountNonce = _accountNonce.toHuman();

    const { signer, source } = account;

    const extension = extensions.find((e: Extension) => e.id === source);
    if (extension === undefined) {
      throw new Error(t('library.wallet_not_found'));
    } else {
      // summons extension popup if not already connected.
      extension.enable(DappName);
    }

    // pre-submission state update
    setSubmitting(true);

    try {
      const unsub = await tx.signAndSend(
        from,
        { signer },
        ({ status, events = [] }: AnyApi) => {
          // extrinsic is ready ( has been signed), add to pending
          if (status.isReady) {
            addPending(accountNonce);
            addNotification({
              title: t('library.pending'),
              subtitle: t('library.transaction_was_initiated'),
            });
            callbackSubmit();
          }

          // extrinsic is in block, assume tx completed
          if (status.isInBlock) {
            setSubmitting(false);
            removePending(accountNonce);
            addNotification({
              title: t('library.in_block'),
              subtitle: t('library.transaction_in_block'),
            });
            callbackInBlock();
          }

          // let user know outcome of transaction
          if (status.isFinalized) {
            events.forEach(({ event: { method } }: AnyApi) => {
              if (method === 'ExtrinsicSuccess') {
                addNotification({
                  title: t('library.finalized'),
                  subtitle: t('library.transaction_successful'),
                });
                unsub();
              } else if (method === 'ExtrinsicFailed') {
                addNotification({
                  title: t('library.failed'),
                  subtitle: t('library.error_with_transaction'),
                });
                setSubmitting(false);
                removePending(accountNonce);
                unsub();
              }
            });
          }
        }
      );
    } catch (e) {
      setSubmitting(false);
      removePending(accountNonce);
      addNotification({
        title: t('library.cancelled'),
        subtitle: t('library.transaction_was_cancelled'),
      });
    }
  };

  return {
    submitTx,
    submitting,
  };
};
