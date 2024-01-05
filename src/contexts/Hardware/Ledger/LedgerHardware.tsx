// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyJson, MaybeString } from 'types';
import { useApi } from 'contexts/Api';
import { getLedgerErrorType } from '../Utils';
import { defaultFeedback, defaultLedgerHardwareContext } from './defaults';
import type {
  FeedbackMessage,
  HandleErrorFeedback,
  LedgerHardwareContextInterface,
  LedgerResponse,
  LedgerStatusCode,
} from './types';
import { Ledger } from './static/ledger';

export const LedgerHardwareContext =
  createContext<LedgerHardwareContextInterface>(defaultLedgerHardwareContext);

export const useLedgerHardware = () => useContext(LedgerHardwareContext);

export const LedgerHardwareProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { t } = useTranslation('modals');
  const { specVersion } = useApi().chainState.version;

  // Store whether a Ledger device task is in progress.
  const [isExecuting, setIsExecutingState] = useState<boolean>(false);
  const isExecutingRef = useRef(isExecuting);
  const getIsExecuting = () => isExecutingRef.current;
  const setIsExecuting = (val: boolean) =>
    setStateWithRef(val, setIsExecutingState, isExecutingRef);

  // Store the latest status code received from a Ledger device.
  const [statusCode, setStatusCodeState] = useState<LedgerResponse | null>(
    null
  );
  const statusCodeRef = useRef<LedgerResponse | null>(statusCode);
  const getStatusCode = () => statusCodeRef.current;
  const setStatusCode = (ack: string, newStatusCode: LedgerStatusCode) => {
    setStateWithRef(
      { ack, statusCode: newStatusCode },
      setStatusCodeState,
      statusCodeRef
    );
  };
  const resetStatusCode = () =>
    setStateWithRef(null, setStatusCodeState, statusCodeRef);

  // Store the feedback message to display as the Ledger device is being interacted with.
  const [feedback, setFeedbackState] =
    useState<FeedbackMessage>(defaultFeedback);
  const feedbackRef = useRef(feedback);
  const getFeedback = () => feedbackRef.current;
  const setFeedback = (message: MaybeString, helpKey: MaybeString = null) =>
    setStateWithRef({ message, helpKey }, setFeedbackState, feedbackRef);
  const resetFeedback = () =>
    setStateWithRef(defaultFeedback, setFeedbackState, feedbackRef);

  // Set feedback message and status code together.
  const setStatusFeedback = ({
    code,
    helpKey,
    message,
  }: HandleErrorFeedback) => {
    setStatusCode('failure', code);
    setFeedback(message, helpKey);
  };

  // Stores whether the Ledger device version has been checked. Used when signing transactions, not
  // when addresses are being imported.
  const [integrityChecked, setIntegrityChecked] = useState<boolean>(false);

  // Store the latest successful device response.
  const [transportResponse, setTransportResponse] = useState<AnyJson>(null);

  // Whether the Ledger device metadata is for a different runtime.
  const runtimesInconsistent = useRef<boolean>(false);

  // Checks whether runtime version is inconsistent with device metadata.
  const checkRuntimeVersion = async (appName: string) => {
    try {
      setIsExecuting(true);
      const { app } = await Ledger.initialise(appName);
      const result = await Ledger.getVersion(app);

      if (Ledger.isError(result)) {
        throw new Error(result.error_message);
      }
      setIsExecuting(false);
      resetFeedback();

      if (result.minor < specVersion) {
        runtimesInconsistent.current = true;
      }
      setIntegrityChecked(true);
    } catch (err) {
      handleErrors(appName, err);
    }
  };

  // Gets an address from Ledger device.
  const handleGetAddress = async (appName: string, accountIndex: number) => {
    try {
      setIsExecuting(true);
      const { app, productName } = await Ledger.initialise(appName);
      const result = await Ledger.getAddress(app, accountIndex);

      if (Ledger.isError(result)) {
        throw new Error(result.error_message);
      }
      setIsExecuting(false);
      setFeedback(t('successfullyFetchedAddress'));
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
      setIsExecuting(true);
      const { app, productName } = await Ledger.initialise(appName);
      setFeedback(t('approveTransactionLedger'));

      const result = await Ledger.signPayload(app, index, payload);

      if (Ledger.isError(result)) {
        throw new Error(result.error_message);
      }
      setIsExecuting(false);
      setFeedback(t('signedTransactionSuccessfully'));
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

  // Handles errors that occur during device calls.
  const handleErrors = (appName: string, err: unknown) => {
    // Update feedback and status code state based on error received.
    switch (getLedgerErrorType(String(err))) {
      // Occurs when the device does not respond to a request within the timeout period.
      case 'timeout':
        setStatusFeedback({
          message: t('ledgerRequestTimeout'),
          helpKey: 'Ledger Request Timeout',
          code: 'DeviceTimeout',
        });
        break;
      // Occurs when a method in a all is not supported by the device.
      case 'methodNotSupported':
        setStatusFeedback({
          message: t('methodNotSupported'),
          code: 'MethodNotSupported',
        });
        break;
      // Occurs when one or more of nested calls being signed does not support nesting.
      case 'nestingNotSupported':
        setStatusFeedback({
          message: t('missingNesting'),
          code: 'NestingNotSupported',
        });
        break;
      // Cccurs when the device is not connected.
      case 'deviceNotConnected':
        setStatusFeedback({
          message: t('connectLedgerToContinue'),
          code: 'DeviceNotConnected',
        });
        break;
      // Occurs when tx was approved outside of active channel.
      case 'outsideActiveChannel':
        setStatusFeedback({
          message: t('queuedTransactionRejected'),
          helpKey: 'Wrong Transaction',
          code: 'WrongTransaction',
        });
        break;
      // Occurs when the device is already in use.
      case 'deviceBusy':
        setStatusFeedback({
          message: t('ledgerDeviceBusy'),
          code: 'DeviceBusy',
        });
        break;
      // Occurs when the device is locked.
      case 'deviceLocked':
        setStatusFeedback({
          message: t('unlockLedgerToContinue'),
          code: 'DeviceLocked',
        });
        break;
      // Occurs when the app (e.g. Polkadot) is not open.
      case 'appNotOpen':
        setStatusFeedback({
          message: t('openAppOnLedger', { appName }),
          helpKey: 'Open App On Ledger',
          code: 'TransactionRejected',
        });
        break;
      // Occurs when a user rejects a transaction.
      case 'transactionRejected':
        setStatusFeedback({
          message: t('transactionRejectedPending'),
          helpKey: 'Ledger Rejected Transaction',
          code: 'AppNotOpen',
        });
        break;
      // Handle all other errors.
      default:
        setFeedback(t('openAppOnLedger', { appName }), 'Open App On Ledger');
        setStatusCode('failure', 'AppNotOpen');
    }

    // Reset refs.
    runtimesInconsistent.current = false;
    // Reset state.
    setIsExecuting(false);
  };

  // Helper to reset ledger state when a task is completed or cancelled.
  const handleResetLedgerTask = () => {
    setIsExecuting(false);
    resetStatusCode();
    resetFeedback();
    setIntegrityChecked(false);
    runtimesInconsistent.current = false;
  };

  // Helper to reset ledger state when the a overlay connecting to the Ledger device unmounts.
  const handleUnmount = () => {
    Ledger.unmount();
    handleResetLedgerTask();
  };

  return (
    <LedgerHardwareContext.Provider
      value={{
        integrityChecked,
        setIntegrityChecked,
        checkRuntimeVersion,
        transportResponse,
        getIsExecuting,
        setIsExecuting,
        getStatusCode,
        setStatusCode,
        resetStatusCode,
        getFeedback,
        setFeedback,
        resetFeedback,
        handleGetAddress,
        handleSignTx,
        handleResetLedgerTask,
        handleErrors,
        handleUnmount,
        runtimesInconsistent: runtimesInconsistent.current,
      }}
    >
      {children}
    </LedgerHardwareContext.Provider>
  );
};
