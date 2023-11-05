// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LedgerAccount } from '@polkadot-cloud/react/types';
import type { AnyJson, MaybeString } from 'types';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';
import { getLedgerErrorType, getLocalLedgerAccounts } from '../Utils';
import {
  TotalAllowedStatusCodes,
  defaultFeedback,
  defaultLedgerHardwareContext,
} from './defaults';
import type {
  FeedbackMessage,
  LedgerHardwareContextInterface,
  LedgerResponse,
  LedgerStatusCode,
} from './types';
import { Ledger } from './static/ledger';

export const LedgerHardwareContext =
  React.createContext<LedgerHardwareContextInterface>(
    defaultLedgerHardwareContext
  );

export const LedgerHardwareProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { specVersion } = useApi().chainState.version;

  // ledgerAccounts
  // Store the fetched ledger accounts.
  const [ledgerAccounts, setLedgerAccountsState] = useState<LedgerAccount[]>(
    getLocalLedgerAccounts(network)
  );
  const ledgerAccountsRef = useRef(ledgerAccounts);

  // TODO: migrate to "inProgress";
  // isExecuting
  // Store whether an import is in progress.
  const [isExecuting, setIsExecutingState] = useState(false);
  const isExecutingRef = useRef(isExecuting);
  const getIsExecuting = () => isExecutingRef.current;
  const setIsExecuting = (val: boolean) =>
    setStateWithRef(val, setIsExecutingState, isExecutingRef);

  // statusCodes
  // Store status codes received from Ledger device.
  const [statusCodes, setStatusCodes] = useState<LedgerResponse[]>([]);
  const statusCodesRef = useRef(statusCodes);
  const getStatusCodes = () => statusCodesRef.current;
  const resetStatusCodes = () =>
    setStateWithRef([], setStatusCodes, statusCodesRef);

  // integrityChecked
  // Stores whether the Ledger device version has been checked. This is used when signing transactions, not when addresses are being imported.
  const [integrityChecked, setIntegrityChecked] = useState<boolean>(false);

  // feedback
  // Get the default message to display, set when a failed loop has happened.
  const [feedback, setFeedbackState] =
    useState<FeedbackMessage>(defaultFeedback);
  const feedbackRef = useRef(feedback);
  const getFeedback = () => feedbackRef.current;
  const setFeedback = (message: MaybeString, helpKey: MaybeString = null) =>
    setStateWithRef({ message, helpKey }, setFeedbackState, feedbackRef);
  const resetFeedback = () =>
    setStateWithRef(defaultFeedback, setFeedbackState, feedbackRef);

  // Store the latest successful device response.
  const [transportResponse, setTransportResponse] = useState<AnyJson>(null);

  // Whether the Ledger device metadata is for a different runtime.
  const runtimesInconsistent = useRef<boolean>(false);

  // Checks whether runtime version is inconsistent with device metadata.
  const checkRuntimeVersion = async (appName: string) => {
    try {
      const { app } = await Ledger.initialise(appName);
      const result = await Ledger.getVersion(app);

      // handle error.
      if (Ledger.isError(result)) {
        throw new Error(result.error_message);
      }

      if (result.minor < specVersion) runtimesInconsistent.current = true;

      setIntegrityChecked(true);
    } catch (err) {
      handleErrors(appName, err);
    }
  };

  // Gets an address from Ledger device.
  const handleGetAddress = async (appName: string, accountIndex: number) => {
    try {
      // start executing.
      setIsExecuting(true);
      const { app, productName } = await Ledger.initialise(appName);
      const result = await Ledger.getAddress(app, accountIndex);

      // handle error.
      if (Ledger.isError(result)) {
        throw new Error(result.error_message);
      }
      // finish executing.
      setIsExecuting(false);

      // set response.
      setFeedback(t('successfullyFetchedAddress'));

      // set status.
      setTransportResponse({
        ack: 'success',
        statusCode: 'ReceivedAddress',
        options: {
          accountIndex,
        },
        device: { productName },
        body: [result],
      });
    } catch (err) {
      handleErrors(appName, err);
    }
  };

  // Signs a payload on Ledger device.
  const handleSignTx = async (
    appName: string,
    uid: number,
    index: number,
    payload: AnyJson
  ) => {
    try {
      // start executing.
      setIsExecuting(true);
      const { app, productName } = await Ledger.initialise(appName);

      // prompt approve on ledger.
      setFeedback(t('approveTransactionLedger'));

      // sign payload.
      const result = await Ledger.signPayload(app, index, payload);

      // handle error.
      if (Ledger.isError(result)) {
        throw new Error(result.error_message);
      }
      // finish executing.
      setIsExecuting(false);

      setFeedback(t('signedTransactionSuccessfully'));

      // set status.
      setTransportResponse({
        statusCode: 'SignedPayload',
        device: { productName },
        body: {
          uid,
          sig: result.signature,
        },
      });
    } catch (err) {
      handleErrors(appName, err);
    }
  };

  // Handle an incoming new status code and persist to state.
  const handleNewStatusCode = (ack: string, statusCode: LedgerStatusCode) => {
    const newStatusCodes = [{ ack, statusCode }, ...statusCodes];

    // Remove last status code if there are more than allowed number of status codes.
    if (newStatusCodes.length > TotalAllowedStatusCodes) newStatusCodes.pop();
    setStateWithRef(newStatusCodes, setStatusCodes, statusCodesRef);
  };

  // Handles errors that occur during device calls.
  const handleErrors = (appName: string, err: unknown) => {
    // Update feedback and status code state based on error received.
    switch (getLedgerErrorType(String(err))) {
      // Occurs when the device does not respond to a request within the timeout period.
      case 'timeout':
        updateFeedbackAndStatusCode({
          message: t('ledgerRequestTimeout'),
          helpKey: 'Ledger Request Timeout',
          code: 'DeviceTimeout',
        });
        break;
      // Occurs when one or more of nested calls being signed does not support nesting.
      case 'nestingNotSupported':
        updateFeedbackAndStatusCode({
          message: t('missingNesting'),
          code: 'NestingNotSupported',
        });
        break;
      // Cccurs when the device is not connected.
      case 'deviceNotConnected':
        updateFeedbackAndStatusCode({
          message: t('connectLedgerToContinue'),
          code: 'DeviceNotConnected',
        });
        break;
      // Occurs when tx was approved outside of active channel.
      case 'outsideActiveChannel':
        updateFeedbackAndStatusCode({
          message: t('queuedTransactionRejected'),
          helpKey: 'Wrong Transaction',
          code: 'WrongTransaction',
        });
        break;
      // Occurs when the device is already in use.
      case 'deviceBusy':
        updateFeedbackAndStatusCode({
          message:
            'The Ledger device is currently being used by other software.',
          code: 'DeviceBusy',
        });
        break;
      // Occurs when the device is locked.
      case 'deviceLocked':
        updateFeedbackAndStatusCode({
          message: t('unlockLedgerToContinue'),
          code: 'DeviceLocked',
        });
        break;
      // Occurs when the app (e.g. Polkadot) is not open.
      case 'appNotOpen':
        updateFeedbackAndStatusCode({
          message: t('openAppOnLedger', { appName }),
          helpKey: 'Open App On Ledger',
          code: 'TransactionRejected',
        });
        break;
      // Occurs when a user rejects a transaction.
      case 'transactionRejected':
        updateFeedbackAndStatusCode({
          message: t('transactionRejectedPending'),
          helpKey: 'Ledger Rejected Transaction',
          code: 'AppNotOpen',
        });
        break;
      // Handle all other errors.
      default:
        setFeedback(t('openAppOnLedger', { appName }), 'Open App On Ledger');
        handleNewStatusCode('failure', 'AppNotOpen');
    }

    // Reset refs.
    runtimesInconsistent.current = false;
    // Reset state.
    setIsExecuting(false);
  };

  // Helper to update feedback message and status code.
  const updateFeedbackAndStatusCode = ({
    message,
    helpKey,
    code,
  }: {
    message: MaybeString;
    helpKey?: MaybeString;
    code: LedgerStatusCode;
  }) => {
    setFeedback(message, helpKey);
    handleNewStatusCode('failure', code);
  };

  // Helper to reset ledger state when a transaction is completed.
  const handleResetLedgerTx = () => {
    setIsExecuting(false);
    resetStatusCodes();
    resetFeedback();
    setIntegrityChecked(false);
    runtimesInconsistent.current = false;
  };

  // Helper to reset ledger state when the a overlay connecting to the Ledger device unmounts.
  const handleUnmount = () => {
    Ledger.unmount();
    handleResetLedgerTx();
  };

  // Refresh imported ledger accounts on network change.
  useEffect(() => {
    setStateWithRef(
      getLocalLedgerAccounts(network),
      setLedgerAccountsState,
      ledgerAccountsRef
    );
  }, [network]);

  return (
    <LedgerHardwareContext.Provider
      value={{
        integrityChecked,
        setIntegrityChecked,
        checkRuntimeVersion,
        transportResponse,
        getIsExecuting,
        setIsExecuting,
        handleNewStatusCode,
        getStatusCodes,
        resetStatusCodes,
        getFeedback,
        setFeedback,
        resetFeedback,
        handleErrors,
        handleUnmount,
        handleGetAddress,
        handleSignTx,
        handleResetLedgerTx,
        runtimesInconsistent: runtimesInconsistent.current,
      }}
    >
      {children}
    </LedgerHardwareContext.Provider>
  );
};

export const useLedgerHardware = () => React.useContext(LedgerHardwareContext);
