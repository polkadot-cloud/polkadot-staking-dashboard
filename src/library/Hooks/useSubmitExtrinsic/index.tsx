// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { DAPP_NAME } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { Extension } from 'contexts/Connect/types';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useNotifications } from 'contexts/Notifications';
import { useTxFees } from 'contexts/TxFees';
import { useEffect, useState } from 'react';
import { AnyApi } from 'types';
import { registerSaEvent } from 'Utils';
import { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types';

export const useSubmitExtrinsic = (
  extrinsic: UseSubmitExtrinsicProps
): UseSubmitExtrinsic => {
  // extract extrinsic info
  const { tx, shouldSubmit, callbackSubmit, callbackInBlock } = extrinsic;

  // if null account is provided, fallback to empty string
  const { from } = extrinsic;
  const submitAddress: string = from ?? '';

  const { api, network } = useApi();
  const { setTxFees, setSender, txFees } = useTxFees();
  const { addNotification } = useNotifications();
  const { addPending, removePending } = useExtrinsics();
  const { getAccount, extensions } = useConnect();
  const networkLower = network.name.toLowerCase();

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
  const submitTx = async (customEventInBlock?: string) => {
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
      throw new Error('wallet not found');
    } else {
      // summons extension popup if not already connected.
      extension.enable(DAPP_NAME);
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
              title: 'Pending',
              subtitle: 'Transaction was initiated.',
            });
            callbackSubmit();
          }

          // extrinsic is in block, assume tx completed
          if (status.isInBlock) {
            // register sa events
            const callInfo = tx.method.toHuman();
            const txEventKey = `${networkLower}_tx_${callInfo.section}_${callInfo.method}`;
            registerSaEvent(txEventKey);
            if (customEventInBlock) {
              registerSaEvent(customEventInBlock);
            }

            setSubmitting(false);
            removePending(accountNonce);
            addNotification({
              title: 'In Block',
              subtitle: 'Transaction in block',
            });
            callbackInBlock();
          }

          // let user know outcome of transaction
          if (status.isFinalized) {
            events.forEach(({ event: { method } }: AnyApi) => {
              if (method === 'ExtrinsicSuccess') {
                addNotification({
                  title: 'Finalized',
                  subtitle: 'Transaction successful',
                });
                unsub();
              } else if (method === 'ExtrinsicFailed') {
                addNotification({
                  title: 'Failed',
                  subtitle: 'Error with transaction',
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
        title: 'Cancelled',
        subtitle: 'Transaction was cancelled',
      });
    }
  };

  return {
    submitTx,
    submitting,
  };
};
