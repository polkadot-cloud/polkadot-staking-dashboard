// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { useBonded } from 'contexts/Bonded';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import type { AnyJson, MaybeAddress } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import * as defaults from './defaults';
import type { TxMetaContextInterface } from './types';

export const TxMetaContext = createContext<TxMetaContextInterface>(
  defaults.defaultTxMeta
);

export const useTxMeta = () => useContext(TxMetaContext);

export const TxMetaProvider = ({ children }: { children: ReactNode }) => {
  const { getBondedAccount } = useBonded();
  const { activeProxy } = useActiveAccounts();
  const { getControllerNotImported } = useStaking();
  const { accountHasSigner } = useImportedAccounts();
  const { getTransferOptions } = useTransferOptions();

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

  // Store an optional signed transaction if extrinsics require manual signing (e.g. Ledger).
  const [txSignature, setTxSignatureState] = useState<AnyJson>(null);
  const txSignatureRef = useRef(txSignature);

  useEffectIgnoreInitial(() => {
    const { balanceTxFees } = getTransferOptions(sender);
    setNotEnoughFunds(balanceTxFees.minus(txFees).isLessThan(0));
  }, [txFees, sender]);

  const resetTxFees = () => {
    setTxFees(new BigNumber(0));
  };

  const getPayloadUid = () => txPayloadRef.current?.uid || 1;

  const incrementPayloadUid = () => (txPayloadRef.current?.uid || 0) + 1;

  const getTxPayload = () => txPayloadRef.current?.payload || null;

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

  const resetTxPayloads = () => {
    setStateWithRef(null, setTxPayloadState, txPayloadRef);
  };

  const getTxSignature = () => txSignatureRef.current;

  const setTxSignature = (s: AnyJson) => {
    setStateWithRef(s, setTxSignatureState, txSignatureRef);
  };

  const txFeesValid = (() => {
    if (txFees.isZero() || notEnoughFunds) {
      return false;
    }
    return true;
  })();

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

  return (
    <TxMetaContext.Provider
      value={{
        controllerSignerAvailable,
        txFees,
        notEnoughFunds,
        setTxFees,
        resetTxFees,
        txFeesValid,
        sender,
        setSender,
        incrementPayloadUid,
        getPayloadUid,
        getTxPayload,
        setTxPayload,
        resetTxPayloads,
        getTxSignature,
        setTxSignature,
      }}
    >
      {children}
    </TxMetaContext.Provider>
  );
};
