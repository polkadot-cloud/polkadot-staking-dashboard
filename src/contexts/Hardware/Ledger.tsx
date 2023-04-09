// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { u8aToBuffer } from '@polkadot/util';
import { setStateWithRef } from '@polkadotcloud/utils';
import { newSubstrateApp } from '@zondax/ledger-substrate';
import { useApi } from 'contexts/Api';
import type { LedgerAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyFunction, AnyJson, MaybeString } from 'types';
import { getLocalLedgerAccounts, getLocalLedgerAddresses } from './Utils';
import {
  LEDGER_DEFAULT_ACCOUNT,
  LEDGER_DEFAULT_CHANGE,
  LEDGER_DEFAULT_INDEX,
  TOTAL_ALLOWED_STATUS_CODES,
  defaultFeedback,
  defaultLedgerHardwareContext,
} from './defaults';
import type {
  FeedbackMessage,
  LedgerAddress,
  LedgerHardwareContextInterface,
  LedgerResponse,
  LedgerStatusCode,
  LedgerTask,
  PairingStatus,
} from './types';

export const LedgerHardwareContext =
  React.createContext<LedgerHardwareContextInterface>(
    defaultLedgerHardwareContext
  );

export const useLedgerHardware = () => React.useContext(LedgerHardwareContext);

export const LedgerHardwareProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();

  const [ledgerAccounts, setLedgerAccountsState] = useState<
    Array<LedgerAccount>
  >(getLocalLedgerAccounts(network.name));
  const ledgerAccountsRef = useRef(ledgerAccounts);

  // Store whether the device has been paired.
  const [isPaired, setIsPairedState] = useState<PairingStatus>('unknown');
  const isPairedRef = useRef(isPaired);

  // Store whether an import is in process.
  const [isExecuting, setIsExecutingState] = useState(false);
  const isExecutingRef = useRef(isExecuting);

  // Store status codes received from Ledger device.
  const [statusCodes, setStatusCodes] = useState<Array<LedgerResponse>>([]);
  const statusCodesRef = useRef(statusCodes);

  // Get the default message to display, set when a failed loop has happened.
  const [feedback, setFeedbackState] =
    useState<FeedbackMessage>(defaultFeedback);

  const feedbackRef = useRef(feedback);

  // Store the latest successful response from an attempted `executeLedgerLoop`.
  const [transportResponse, setTransportResponse] = useState<AnyJson>(null);

  // Whether pairing is in progress: protects against re-renders & duplicate attempts.
  const pairInProgress = useRef(false);

  // Whether a ledger-loop is in progress: protects against re-renders & duplicate attempts.
  const ledgerLoopInProgress = useRef(false);

  // The ledger transport interface.
  const ledgerTransport = useRef<any>(null);

  // Refresh imported ledger accounts on network change.
  useEffect(() => {
    setStateWithRef(
      getLocalLedgerAccounts(network.name),
      setLedgerAccountsState,
      ledgerAccountsRef
    );
  }, [network]);

  // Handles errors that occur during `executeLedgerLoop` and `pairDevice` calls.
  const handleErrors = (appName: string, err: AnyJson) => {
    // reset any in-progress calls.
    ledgerLoopInProgress.current = false;
    pairInProgress.current = false;

    // execution failed - no longer executing.
    setIsExecuting(false);

    // close any open device connections.
    if (ledgerTransport.current?.device?.opened) {
      ledgerTransport.current?.device?.close();
    }

    // format error message.
    err = String(err);
    if (err === 'Error: Timeout') {
      // only set default message here - maintain previous status code.
      setFeedback(t('ledgerRequestTimeout'), 'Ledger Request Timeout');
      handleNewStatusCode('failure', 'DeviceTimeout');
    } else if (
      err.startsWith('Error: TransportError: Invalid channel') ||
      err.startsWith('Error: InvalidStateError')
    ) {
      // occurs when tx was approved outside of active channel.
      setFeedback(t('queuedTransactionRejected'), 'Wrong Transaction');
      handleNewStatusCode('failure', 'WrongTransaction');
    } else if (
      err.startsWith('TransportOpenUserCancelled') ||
      err.startsWith('Error: Ledger Device is busy')
    ) {
      // occurs when the device is not connected.
      setFeedback(t('connectLedgerToContinue'));
      handleNewStatusCode('failure', 'DeviceNotConnected');
    } else if (err.startsWith('Error: LockedDeviceError')) {
      // occurs when the device is connected but not unlocked.
      setFeedback(t('unlockLedgerToContinue'));
      handleNewStatusCode('failure', 'DeviceLocked');
    } else if (err.startsWith('Error: Transaction rejected')) {
      // occurs when user rejects a transaction.
      setFeedback(
        t('transactionRejectedPending'),
        'Ledger Rejected Transaction'
      );
      handleNewStatusCode('failure', 'TransactionRejected');
    } else if (err.startsWith('Error: Unknown Status Code: 28161')) {
      // occurs when the required app is not open.
      handleNewStatusCode('failure', 'AppNotOpenContinue');
      setFeedback(t('openAppOnLedger', { appName }), 'Open App On Ledger');
    } else {
      // miscellanous errors - assume app is not open or ready.
      setFeedback(t('openAppOnLedger', { appName }), 'Open App On Ledger');
      handleNewStatusCode('failure', 'AppNotOpen');
    }
  };

  // Timeout function for hanging tasks. Used for tasks that require no input from the device, such
  // as getting an address that does not require confirmation.
  const withTimeout = (millis: AnyFunction, promise: AnyFunction) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(async () => {
        ledgerTransport.current?.device?.close();
        reject(Error('Timeout'));
      }, millis)
    );
    return Promise.race([promise, timeout]);
  };

  // Attempt to pair a device.
  //
  // Trigger a one-time connection to the device to determine if it is available. If the device
  // needs to be paired, a browser prompt will open. If cancelled, an error will be thrown.
  const pairDevice = async () => {
    try {
      // return `paired` if pairing is already in progress.
      if (pairInProgress.current) {
        return isPairedRef.current === 'paired';
      }
      // set pairing in progress.
      pairInProgress.current = true;

      // remove any previously stored status codes.
      resetStatusCodes();

      // close any open connections.
      if (ledgerTransport.current?.device?.opened) {
        await ledgerTransport.current?.device?.close();
      }
      // establish a new connection with device.
      ledgerTransport.current = await TransportWebHID.create();
      setIsPaired('paired');
      pairInProgress.current = false;
      return true;
    } catch (err) {
      pairInProgress.current = false;
      handleErrors('', err);
      return false;
    }
  };

  // Connects to a Ledger device to perform a task. This is the main execute function that handles
  // all Ledger tasks, along with errors that occur during the process.
  const executeLedgerLoop = async (
    appName: string,
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => {
    try {
      // do not execute again if already in progress.
      if (ledgerLoopInProgress.current) {
        return;
      }

      // set ledger loop in progress.
      ledgerLoopInProgress.current = true;

      // test for tasks and execute them. This is designed such that `result` will only store the
      // result of one task. This will have to be refactored if we ever need to execute multiple
      // tasks at once.
      let result = null;
      if (tasks.includes('get_address')) {
        result = await handleGetAddress(appName, options?.accountIndex || 0);
      } else if (tasks.includes('sign_tx')) {
        const uid = options?.uid || 0;
        const index = options?.accountIndex || 0;
        const payload = options?.payload || '';

        result = await handleSignTx(appName, uid, index, payload);
      }

      // a populated result indicates a successful execution. Set the transport response state for
      // other components to respond to via useEffect.
      if (result) {
        setTransportResponse({
          ack: 'success',
          options,
          ...result,
        });
      }
      ledgerLoopInProgress.current = false;
    } catch (err) {
      handleErrors(appName, err);
    }
  };

  // Gets an app address on device.
  const handleGetAddress = async (appName: string, index: number) => {
    const substrateApp = newSubstrateApp(ledgerTransport.current, appName);
    const { deviceModel } = ledgerTransport.current;
    const { id, productName } = deviceModel;

    resetFeedback();
    setTransportResponse({
      ack: 'success',
      statusCode: 'GettingAddress',
      body: null,
    });

    if (!ledgerTransport.current?.device?.opened) {
      await ledgerTransport.current?.device?.open();
    }
    const result: AnyJson = await withTimeout(
      3000,
      substrateApp.getAddress(
        LEDGER_DEFAULT_ACCOUNT + index,
        LEDGER_DEFAULT_CHANGE,
        LEDGER_DEFAULT_INDEX + 0,
        false
      )
    );

    await ledgerTransport.current?.device?.close();

    const error = result?.error_message;
    if (error) {
      if (!error.startsWith('No errors')) {
        throw new Error(error);
      }
    }

    if (!(result instanceof Error)) {
      return {
        statusCode: 'ReceivedAddress',
        device: { id, productName },
        body: [result],
      };
    }
  };

  // Signs a payload on device.
  const handleSignTx = async (
    appName: string,
    uid: number,
    index: number,
    payload: AnyJson
  ) => {
    const substrateApp = newSubstrateApp(ledgerTransport.current, appName);
    const { deviceModel } = ledgerTransport.current;
    const { id, productName } = deviceModel;

    setTransportResponse({
      ack: 'success',
      statusCode: 'SigningPayload',
      body: null,
    });

    setFeedback(t('approveTransactionLedger'));

    if (!ledgerTransport.current?.device?.opened) {
      await ledgerTransport.current?.device?.open();
    }
    const result = await substrateApp.sign(
      LEDGER_DEFAULT_ACCOUNT + index,
      LEDGER_DEFAULT_CHANGE,
      LEDGER_DEFAULT_INDEX + 0,
      u8aToBuffer(payload.toU8a(true))
    );

    setFeedback(t('signedTransactionSuccessfully'));
    await ledgerTransport.current?.device?.close();

    const error = result?.error_message;
    if (error) {
      if (!error.startsWith('No errors')) {
        throw new Error(error);
      }
    }

    if (!(result instanceof Error)) {
      return {
        statusCode: 'SignedPayload',
        device: { id, productName },
        body: {
          uid,
          sig: result.signature,
        },
      };
    }
  };

  // Handle an incoming new status code and persist to state.
  const handleNewStatusCode = (ack: string, statusCode: LedgerStatusCode) => {
    const newStatusCodes = [{ ack, statusCode }, ...statusCodes];

    // Remove last status code if there are more than allowed number of status codes.
    if (newStatusCodes.length > TOTAL_ALLOWED_STATUS_CODES) {
      newStatusCodes.pop();
    }
    setStateWithRef(newStatusCodes, setStatusCodes, statusCodesRef);
  };

  // Check if an address exists in imported addresses.
  const ledgerAccountExists = (address: string) =>
    !!getLocalLedgerAccounts().find((a: LedgerAccount) =>
      isLocalAddress(a, address)
    );

  const addLedgerAccount = (address: string, index: number) => {
    let newLedgerAccounts = getLocalLedgerAccounts();

    const ledgerAddress = getLocalLedgerAddresses().find((a: LedgerAddress) =>
      isLocalAddress(a, address)
    );

    if (
      ledgerAddress &&
      !newLedgerAccounts.find((a: LedgerAccount) => isLocalAddress(a, address))
    ) {
      const account = {
        address,
        network: network.name,
        name: ledgerAddress.name,
        source: 'ledger',
        index,
      };

      // update the full list of local ledger accounts with new entry.
      newLedgerAccounts = [...newLedgerAccounts].concat(account);
      localStorage.setItem(
        'ledger_accounts',
        JSON.stringify(newLedgerAccounts)
      );

      // store only those accounts on the current network in state.
      setStateWithRef(
        newLedgerAccounts.filter(
          (a: LedgerAccount) => a.network === network.name
        ),
        setLedgerAccountsState,
        ledgerAccountsRef
      );

      return account;
    }
    return null;
  };

  const removeLedgerAccount = (address: string) => {
    let newLedgerAccounts = getLocalLedgerAccounts();

    newLedgerAccounts = newLedgerAccounts.filter((a: LedgerAccount) => {
      if (a.address !== address) {
        return true;
      }
      if (a.network !== network.name) {
        return true;
      }
      return false;
    });
    if (!newLedgerAccounts.length) {
      localStorage.removeItem('ledger_accounts');
    } else {
      localStorage.setItem(
        'ledger_accounts',
        JSON.stringify(newLedgerAccounts)
      );
    }
    setStateWithRef(
      newLedgerAccounts.filter(
        (a: LedgerAccount) => a.network === network.name
      ),
      setLedgerAccountsState,
      ledgerAccountsRef
    );
  };

  // Gets an imported address along with its Ledger metadata.
  const getLedgerAccount = (address: string) => {
    const localLedgerAccounts = getLocalLedgerAccounts();

    if (!localLedgerAccounts) {
      return null;
    }
    return (
      localLedgerAccounts.find((a: LedgerAccount) =>
        isLocalAddress(a, address)
      ) ?? null
    );
  };

  const renameLedgerAccount = (address: string, newName: string) => {
    let newLedgerAccounts = getLocalLedgerAccounts();

    newLedgerAccounts = newLedgerAccounts.map((a: LedgerAccount) =>
      isLocalAddress(a, address)
        ? {
            ...a,
            name: newName,
          }
        : a
    );

    localStorage.setItem('ledger_accounts', JSON.stringify(newLedgerAccounts));
    setStateWithRef(
      newLedgerAccounts.filter(
        (a: LedgerAccount) => a.network === network.name
      ),
      setLedgerAccountsState,
      ledgerAccountsRef
    );
  };

  const isLocalAddress = (
    a: LedgerAccount | LedgerAddress,
    address: string
  ) => {
    return a.address === address && a.network === network.name;
  };

  const getTransport = () => {
    return ledgerTransport.current;
  };

  const getIsExecuting = () => {
    return isExecutingRef.current;
  };

  const getStatusCodes = () => {
    return statusCodesRef.current;
  };

  const getFeedback = () => {
    return feedbackRef.current;
  };

  const setFeedback = (message: MaybeString, helpKey: MaybeString = null) => {
    setStateWithRef({ message, helpKey }, setFeedbackState, feedbackRef);
  };

  const resetFeedback = () => {
    setStateWithRef(defaultFeedback, setFeedbackState, feedbackRef);
  };

  const setIsPaired = (p: PairingStatus) => {
    setStateWithRef(p, setIsPairedState, isPairedRef);
  };

  const setIsExecuting = (val: boolean) => {
    setStateWithRef(val, setIsExecutingState, isExecutingRef);
  };

  const resetStatusCodes = () => {
    setStateWithRef([], setStatusCodes, statusCodesRef);
  };

  const handleUnmount = () => {
    // reset refs
    ledgerLoopInProgress.current = false;
    pairInProgress.current = false;
    // reset state
    resetStatusCodes();
    setIsExecuting(false);
    resetFeedback();
    // close transport
    if (getTransport()?.device?.opened) {
      getTransport().device.close();
    }
  };

  return (
    <LedgerHardwareContext.Provider
      value={{
        pairDevice,
        transportResponse,
        executeLedgerLoop,
        setIsPaired,
        setIsExecuting,
        handleNewStatusCode,
        resetStatusCodes,
        getIsExecuting,
        getStatusCodes,
        getTransport,
        ledgerAccountExists,
        addLedgerAccount,
        removeLedgerAccount,
        renameLedgerAccount,
        getLedgerAccount,
        getFeedback,
        setFeedback,
        resetFeedback,
        handleUnmount,
        isPaired: isPairedRef.current,
        ledgerAccounts: ledgerAccountsRef.current,
      }}
    >
      {children}
    </LedgerHardwareContext.Provider>
  );
};
