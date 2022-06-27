// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useApi } from 'contexts/Api';
import { useNotifications } from 'contexts/Notifications';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useConnect } from 'contexts/Connect';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { getWalletBySource, Wallet } from '@talisman-connect/wallets';
import { DAPP_NAME } from 'consts';
import { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types';

export const useSubmitExtrinsic = (
  extrinsic: UseSubmitExtrinsicProps
): UseSubmitExtrinsic => {
  // extract extrinsic info
  const { tx, shouldSubmit, callbackSubmit, callbackInBlock } = extrinsic;

  // if null account is provided, fallback to empty string
  const { from } = extrinsic;
  const submitAddress: string = from ?? '';

  const { api } = useApi() as APIContextInterface;
  const { addNotification } = useNotifications();
  const { addPending, removePending } = useExtrinsics();
  const { getAccount } = useConnect() as ConnectContextInterface;

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
    const info = await tx.paymentInfo(submitAddress);
    // convert fee to unit
    setEstimatedFee(info.partialFee.toHuman());
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

    const accountNonce = await api.rpc.system.accountNextIndex(submitAddress);
    const { signer, source } = account;

    // get extension
    const extension: Wallet | undefined = getWalletBySource(source);
    if (extension === undefined) {
      throw new Error('wallet not found');
    } else {
      // summons extension popup if not already connected.
      await extension.enable(DAPP_NAME);
    }

    // pre-submission state update
    setSubmitting(true);

    try {
      const unsub = await tx.signAndSend(
        from,
        { signer },
        ({ status, nonce, events = [] }: any) => {
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
            events.forEach(
              ({ phase, event: { data, method, section } }: any) => {
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
              }
            );
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
    estimatedFee,
    submitting,
  };
};
