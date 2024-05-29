// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { useBonded } from 'contexts/Bonded';
import { useStaking } from 'contexts/Staking';
import type { AnyJson, MaybeAddress } from 'types';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import * as defaults from './defaults';
import type { TxMetaContextInterface } from './types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { useApi } from 'contexts/Api';

export const TxMetaContext = createContext<TxMetaContextInterface>(
  defaults.defaultTxMeta
);

export const useTxMeta = () => useContext(TxMetaContext);

export const TxMetaProvider = ({ children }: { children: ReactNode }) => {
  const {
    consts: { existentialDeposit },
  } = useApi();
  const { getBondedAccount } = useBonded();
  const { activeProxy } = useActiveAccounts();
  const { getControllerNotImported } = useStaking();
  const { accountHasSigner } = useImportedAccounts();

  // Store the transaction fees for the transaction.
  const [txFees, setTxFees] = useState<BigNumber>(new BigNumber(0));

  // Store the sender of the transaction.
  const [sender, setSender] = useState<MaybeAddress>(null);

  // Store whether the sender does not have enough funds.
  const [notEnoughFunds, setNotEnoughFunds] = useState<boolean>(false);

  // Store the payloads of transactions if extrinsics require manual signing (e.g. Ledger). payloads
  // are calculated asynchronously and extrinsic associated with them may be cancelled. For this
  // reason we give every payload a uid, and check whether this uid matches the active extrinsic
  // before submitting it.
  const [txPayload, setTxPayloadState] = useState<{
    payload: AnyJson;
    uid: number;
  } | null>(null);
  const txPayloadRef = useRef(txPayload);
  const getPayloadUid = () => txPayloadRef.current?.uid || 1;
  const getTxPayload = () => txPayloadRef.current?.payload || null;

  // Store an optional signed transaction if extrinsics require manual signing (e.g. Ledger).
  const [txSignature, setTxSignatureState] = useState<AnyJson>(null);
  const txSignatureRef = useRef(txSignature);
  const getTxSignature = () => txSignatureRef.current;

  // Set the transaction signature. Overwrites any existing signature.
  const setTxSignature = (s: AnyJson) => {
    setStateWithRef(s, setTxSignatureState, txSignatureRef);
  };

  // Store the pending nonces of transactions. NOTE: Ref is required as `pendingNonces` is read in
  // callbacks.
  const [pendingNonces, setPendingNonces] = useState<string[]>([]);
  const pendingNoncesRef = useRef(pendingNonces);

  // Listen to balance updates for the tx sender.
  const { getBalance, getEdReserved } = useActiveBalances({
    accounts: [sender],
  });

  // Set the transaction payload and uid. Overwrites any existing payload.
  const setTxPayload = (p: AnyJson, uid: number) => {
    setStateWithRef(
      {
        payload: p,
        uid,
      },
      setTxPayloadState,
      txPayloadRef
    );
  };

  // Removes the transaction payload and uid from state.
  const resetTxPayload = () => {
    setStateWithRef(null, setTxPayloadState, txPayloadRef);
  };

  // TODO: Remove controller checks once controller deprecation is completed on chain.
  const controllerSignerAvailable = (
    stash: MaybeAddress,
    proxySupported: boolean
  ) => {
    const controller = getBondedAccount(stash);

    if (controller !== stash) {
      if (getControllerNotImported(controller)) {
        return 'controller_not_imported';
      }

      if (!accountHasSigner(controller)) {
        return 'read_only';
      }
    } else if (
      (!proxySupported || !accountHasSigner(activeProxy)) &&
      !accountHasSigner(stash)
    ) {
      return 'read_only';
    }
    return 'ok';
  };

  // Adds a pending nonce to the list of pending nonces.
  const addPendingNonce = (nonce: string) => {
    setStateWithRef(
      [...pendingNoncesRef.current].concat(nonce),
      setPendingNonces,
      pendingNoncesRef
    );
  };

  // Removes a pending nonce from the list of pending nonces.
  const removePendingNonce = (nonce: string) => {
    setStateWithRef(
      pendingNoncesRef.current.filter((n) => n !== nonce),
      setPendingNonces,
      pendingNoncesRef
    );
  };

  // Utility to reset transaction fees to zero.
  const resetTxFees = () => {
    setTxFees(new BigNumber(0));
  };

  // Utility to increment payload uid to maintain unique ids for payloads.
  const incrementPayloadUid = () => (txPayloadRef.current?.uid || 0) + 1;

  // Check if the transaction fees are valid.
  const txFeesValid = txFees.isZero() || notEnoughFunds ? false : true;

  // Refresh not enough funds status when sender, balance or txFees change.
  const senderBalances = getBalance(sender);
  useEffectIgnoreInitial(() => {
    const edReserved = getEdReserved(sender, existentialDeposit);
    const { free, frozen } = senderBalances;
    const balanceforTxFees = free.minus(edReserved).minus(frozen);

    setNotEnoughFunds(balanceforTxFees.minus(txFees).isLessThan(0));
  }, [txFees, sender, senderBalances]);

  return (
    <TxMetaContext.Provider
      value={{
        sender,
        setSender,
        txFees,
        txFeesValid,
        setTxFees,
        resetTxFees,
        notEnoughFunds,
        getPayloadUid,
        getTxPayload,
        setTxPayload,
        incrementPayloadUid,
        resetTxPayload,
        getTxSignature,
        setTxSignature,
        pendingNonces,
        addPendingNonce,
        removePendingNonce,
        controllerSignerAvailable,
      }}
    >
      {children}
    </TxMetaContext.Provider>
  );
};
