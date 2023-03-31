// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import { cryptoWaitReady, signatureVerify } from '@polkadot/util-crypto';
import { ExtrinsicPayloadValue } from '@polkadot/types/types';

import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { SessionTypes } from '@walletconnect/types';
import BigNumber from 'bignumber.js';
import { DappName } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useExtensions } from 'contexts/Extensions';
import { ExtensionInjected } from 'contexts/Extensions/types';
import { useExtrinsics } from 'contexts/Extrinsics';
import { useNotifications } from 'contexts/Notifications';
import { useTxFees } from 'contexts/TxFees';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi } from 'types';
import { UseSubmitExtrinsic, UseSubmitExtrinsicProps } from './types';

export const useSubmitExtrinsic = ({
  tx,
  shouldSubmit,
  callbackSubmit,
  callbackInBlock,
  from,
}: UseSubmitExtrinsicProps): UseSubmitExtrinsic => {
  const { t } = useTranslation('library');
  const { api } = useApi();
  const { setTxFees, setSender, txFees } = useTxFees();
  const { addNotification } = useNotifications();
  const { addPending, removePending } = useExtrinsics();
  const { extensions } = useExtensions();
  const { getAccount, getClient, getSession, getWcChainInfo } = useConnect();

  // if null account is provided, fallback to empty string
  const submitAddress: string = from ?? '';

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
    const partialFeeBn = new BigNumber(partialFee.toString());

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

    const extension = extensions.find(
      (e: ExtensionInjected) => e.id === source
    );
    if (extension === undefined) {
      throw new Error(`${t('walletNotFound')}`);
    } else if (extension.id === 'wallet-connect') {
      const client: SignClient | null = getClient();
      const session: SessionTypes.Struct | null = getSession();
      const wcChainInfo: string | null = getWcChainInfo();

      console.log('what is wc chain info', wcChainInfo);
      console.log('what is client in submit', client);
      console.log('what is session in submit', session);
      console.log('what is tx in submit', tx);
      console.log('what is tx as json', tx.toJSON());
      console.log('what is tx raw', tx.toRawType());
      console.log('what is tx to human', tx.toHuman());
      console.log('what is tx  method', tx.method.toHex());
      console.log('what is tx era', tx.era.toHex());
      console.log('what is tx registry metadata', tx.registry.metadata);

      interface IFormattedRpcResponse {
        method?: string;
        address?: string;
        valid: boolean;
        signature: any;
        payload?: ExtrinsicPayloadValue | undefined;
      }
      const { block } = await api.rpc.chain.getBlock();
      const blockHash = await api.rpc.chain.getBlockHash();
      const genesisHash = await api.genesisHash;
      const metadata = await api.rpc.state.getMetadata();
      const { specVersion, transactionVersion, specName } =
        await api.rpc.state.getRuntimeVersion();

      console.log('what is block number', block.header.number);
      console.log('what is blockHash', blockHash.hash);
      console.log('what is genesis Hash', genesisHash);
      console.log('what is metadata', metadata);
      console.log('what is specVersion', specVersion);
      console.log('what is transactionVersion', transactionVersion.toHuman());
      console.log('what is specName', specName);
      console.log('what is the tx version per dashboards view', tx.version);
      console.log('what is era to hex', tx.era.toHuman());
      console.log('what is method to human', tx.method.toHuman());

      const _wcAccountNonce = await api.rpc.system.accountNextIndex(
        submitAddress
      );
      const wcAccountNonce = _wcAccountNonce.toHuman();
      const blockNumber = block.header.number;

      console.log('wc account nonce', wcAccountNonce);
      const unsigned = {
        specVersion: specVersion.toHex(),
        transactionVersion: transactionVersion.toHex(),
        address: `${submitAddress}`,
        blockHash: blockHash.toHex(),
        blockNumber,
        era: api.registry.createType('ExtrinsicEra', {
          current: blockNumber,
          period: 64,
        }),
        genesisHash: genesisHash.toHex(),
        method: tx.method.toHex(),
        nonce: wcAccountNonce,
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
        tip: '0x00000000000000000000000000000000',
        version: 4,
      };
      console.log(unsigned);

      const sendWalletConnectTx = async (
        chainId: string,
        fromAddress: string
      ): Promise<IFormattedRpcResponse> => {
        setSubmitting(true);
        addPending(wcAccountNonce);
        addNotification({
          title: t('pending'),
          subtitle: t('transactionInitiated'),
        });
        try {
          const result = await client!.request<{
            signature: string;
          }>({
            chainId,
            topic: session!.topic,
            request: {
              method: 'polkadot_signTransaction',
              params: {
                address: fromAddress,
                transactionPayload: unsigned,
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
          console.log('error occurred', error);
          setSubmitting(false);
          removePending(wcAccountNonce);
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

      const result = await sendWalletConnectTx(
        wcChainInfo as string,
        submitAddress
      );

      console.log('from value', from);

      const signingPayload = api.registry.createType(
        'ExtrinsicPayload',
        unsigned,
        {
          version: unsigned.version,
        }
      );

      tx.addSignature(submitAddress, result.signature, signingPayload);
      try {
        const unsub = await tx.send(({ status, events = [] }: AnyApi) => {
          // extrinsic is ready ( has been signed), add to pending
          if (status.isReady) {
            addPending(accountNonce);
            addNotification({
              title: t('pending'),
              subtitle: t('transactionInitiated'),
            });
            callbackSubmit();
          }

          // extrinsic is in block, assume tx completed
          if (status.isInBlock) {
            setSubmitting(false);
            removePending(accountNonce);
            addNotification({
              title: t('inBlock'),
              subtitle: t('transactionInBlock'),
            });
            callbackInBlock();
          }

          // let user know outcome of transaction
          if (status.isFinalized) {
            events.forEach(({ event: { method } }: AnyApi) => {
              if (method === 'ExtrinsicSuccess') {
                addNotification({
                  title: t('finalized'),
                  subtitle: t('transactionSuccessful'),
                });
                unsub();
              } else if (method === 'ExtrinsicFailed') {
                addNotification({
                  title: t('failed'),
                  subtitle: t('errorWithTransaction'),
                });
                setSubmitting(false);
                removePending(accountNonce);
                unsub();
              }
            });
          }
        });
      } catch (e) {
        console.log('error occurred', e);
        setSubmitting(false);
        removePending(accountNonce);
        addNotification({
          title: t('cancelled'),
          subtitle: t('transactionCancelled'),
        });
      }
    } else {
      // summons extension popup if not already connected.
      extension.enable(DappName);
      // pre-submission state update
      setSubmitting(true);

      try {
        const unsub = await tx.signAndSend(
          from,
          { signer },
          ({ status, events = [] }: AnyApi) => {
            console.log('status', status);
            console.log('events', events);
            // extrinsic is ready ( has been signed), add to pending
            if (status.isReady) {
              addPending(accountNonce);
              addNotification({
                title: t('pending'),
                subtitle: t('transactionInitiated'),
              });
              callbackSubmit();
            }

            // extrinsic is in block, assume tx completed
            if (status.isInBlock) {
              setSubmitting(false);
              removePending(accountNonce);
              addNotification({
                title: t('inBlock'),
                subtitle: t('transactionInBlock'),
              });
              callbackInBlock();
            }

            // let user know outcome of transaction
            if (status.isFinalized) {
              events.forEach(({ event: { method } }: AnyApi) => {
                if (method === 'ExtrinsicSuccess') {
                  addNotification({
                    title: t('finalized'),
                    subtitle: t('transactionSuccessful'),
                  });
                  unsub();
                } else if (method === 'ExtrinsicFailed') {
                  addNotification({
                    title: t('failed'),
                    subtitle: t('errorWithTransaction'),
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
        console.log('error occurred', e);
        setSubmitting(false);
        removePending(accountNonce);
        addNotification({
          title: t('cancelled'),
          subtitle: t('transactionCancelled'),
        });
      }
    }
  };

  return {
    submitTx,
    submitting,
  };
};
