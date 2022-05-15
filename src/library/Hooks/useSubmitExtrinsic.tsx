// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useApi } from '../../contexts/Api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useNotifications } from '../../contexts/Notifications';
import { useExtrinsics } from '../../contexts/Extrinsics';

export const useSubmitExtrinsic = (extrinsic: any) => {

  // extract extrinsic info
  const {
    tx,
    from,
    shouldSubmit,
    callbackSubmit,
    callbackInBlock
  } = extrinsic;

  const { api }: any = useApi();
  const { addNotification } = useNotifications();
  const { addPending, removePending } = useExtrinsics();

  // whether the transaction is in progress
  const [submitting, setSubmitting] = useState(false);

  // get the estimated fee for submitting the transaction
  const [estimatedFee, setEstimatedFee] = useState(null);

  // calculate fee upon setup changes and initial render
  useEffect(() => {
    calculateEstimatedFee();
  }, [extrinsic]);

  const calculateEstimatedFee = async () => {
    if (tx === null) {
      return;
    }
    // get payment info
    const info = await tx
      .paymentInfo(from);
    // convert fee to unit
    setEstimatedFee(info.partialFee.toHuman());
  }

  // submit extrinsic
  const submitTx = async () => {
    if (submitting || !shouldSubmit) {
      return;
    }
    const accountNonce = await api.rpc.system.accountNextIndex(from);
    const injector = await web3FromAddress(from);

    // pre-submission state update
    setSubmitting(true);
    addPending(accountNonce);
    addNotification({
      title: 'Pending',
      subtitle: 'Transaction was initiated.',
    });

    callbackSubmit();

    try {
      const unsub = await tx
        .signAndSend(from, { signer: injector.signer }, ({ status, nonce, events = [] }: any) => {

          // extrinsic is in block, assume tx completed
          if (status.isInBlock) {
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
            events.forEach(({ phase, event: { data, method, section } }: any) => {

              if (method === 'ExtrinsicSuccess') {
                addNotification({
                  title: 'Finalized',
                  subtitle: 'Transaction successful',
                });
                unsub();
              }
              else if (method === 'ExtrinsicFailed') {
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
        });
    } catch (e) {
      setSubmitting(false);
      removePending(accountNonce);
      addNotification({
        title: 'Cancelled',
        subtitle: 'Transaction was cancelled',
      });
    }
  }

  return {
    submitTx: submitTx,
    estimatedFee: estimatedFee,
    submitting: submitting,
  }
}