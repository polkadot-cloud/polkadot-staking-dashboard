// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { u8aToBuffer } from '@polkadot/util';
import { newSubstrateApp } from '@zondax/ledger-substrate';
import { setStateWithRef } from 'Utils';
import { useApi } from 'contexts/Api';
import type { LedgerAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyFunction, AnyJson } from 'types';
import { getLocalLedgerAccounts, getLocalLedgerAddresses } from './Utils';
import {
  LEDGER_DEFAULT_ACCOUNT,
  LEDGER_DEFAULT_CHANGE,
  LEDGER_DEFAULT_INDEX,
  TOTAL_ALLOWED_STATUS_CODES,
  defaultLedgerHardwareContext,
} from './defaults';
import type {
  LedgerAddress,
  LedgerHardwareContextInterface,
  LedgerResponse,
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
  const [defaultMessage, setDefaultMessageState] = useState<string | null>(
    null
  );
  const defaultMessageRef = useRef(defaultMessage);

  // Store the latest successful response from an attempted `executeLedgerLoop`.
  const [transportResponse, setTransportResponse] = useState<AnyJson>(null);

  const pairInProgress = useRef(false);

  const ledgerInProgress = useRef(false);

  // The ledger transport interface.
  const ledgerTransport = useRef<any>(null);

  // refresh imported ledger accounts on network change.
  useEffect(() => {
    setStateWithRef(
      getLocalLedgerAccounts(network.name),
      setLedgerAccountsState,
      ledgerAccountsRef
    );
  }, [network]);

  // Handles errors that occur during a `executeLedgerLoop`.
  const handleErrors = (appName: string, err: AnyJson) => {
    ledgerInProgress.current = false;
    setIsExecuting(false);
    err = String(err);

    // close any open connections.
    if (ledgerTransport.current?.device?.opened) {
      ledgerTransport.current?.device?.close();
    }

    if (err === 'Error: Timeout') {
      // only set default message here - maintain previous status code.
      setDefaultMessage(t('ledgerRequestTimeout'));
    } else if (
      err.startsWith('TransportOpenUserCancelled') ||
      err.startsWith('Error: Ledger Device is busy')
    ) {
      setDefaultMessage(t('connectLedgerToContinue'));
      handleNewStatusCode('failure', 'DeviceNotConnected');
    } else if (err.startsWith('Error: Transaction rejected')) {
      setDefaultMessage(t('transactionRejectedPending'));
      handleNewStatusCode('failure', 'TransactionRejected');
    } else if (err.startsWith('Error: Unknown Status Code: 28161')) {
      handleNewStatusCode('failure', 'AppNotOpenContinue');
      setDefaultMessage(t('openAppOnLedger', { appName }));
    } else {
      setDefaultMessage(t('openAppOnLedger', { appName }));
      handleNewStatusCode('failure', 'AppNotOpen');
    }
  };

  // Timeout function for hanging tasks.
  const withTimeout = (millis: AnyFunction, promise: AnyFunction) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(async () => {
        ledgerTransport.current?.device?.close();
        reject(Error('Timeout'));
      }, millis)
    );
    return Promise.race([promise, timeout]);
  };

  // Check whether the device is paired.
  //
  // Trigger a one-time connection to the device to determine if it is available. If the device
  // needs to be paired, a browser prompt will pop up and initialisation of `transport` will throw
  // an error.
  const pairDevice = async () => {
    try {
      if (pairInProgress.current) {
        return isPairedRef.current === 'paired';
      }
      pairInProgress.current = true;

      resetStatusCodes();
      // Close any open connections.
      if (ledgerTransport.current?.device?.opened) {
        await ledgerTransport.current?.device?.close();
      }
      // Establish a new connection with device.
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

  // Connects to a Ledger device to perform a task.
  const executeLedgerLoop = async (
    appName: string,
    transport: AnyJson,
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => {
    try {
      if (ledgerInProgress.current) {
        return;
      }
      ledgerInProgress.current = true;

      let result = null;
      if (tasks.includes('get_address')) {
        result = await handleGetAddress(
          appName,
          transport,
          options?.accountIndex || 0
        );
      } else if (tasks.includes('sign_tx')) {
        result = await handleSignTx(
          appName,
          transport,
          options?.accountIndex || 0,
          options?.payload || ''
        );
      }
      if (result) {
        setTransportResponse({
          ack: 'success',
          options,
          ...result,
        });
      }
      ledgerInProgress.current = false;
    } catch (err) {
      handleErrors(appName, err);
    }
  };

  // Gets an app address on device.
  const handleGetAddress = async (
    appName: string,
    transport: AnyJson,
    index: number
  ) => {
    const substrateApp = newSubstrateApp(transport, appName);
    const { deviceModel } = transport;
    const { id, productName } = deviceModel;

    setDefaultMessage(null);
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
    transport: AnyJson,
    index: number,
    payload: AnyJson
  ) => {
    const substrateApp = newSubstrateApp(transport, appName);
    const { deviceModel } = transport;
    const { id, productName } = deviceModel;

    setTransportResponse({
      ack: 'success',
      statusCode: 'SigningPayload',
      body: null,
    });

    setDefaultMessage(t('approveTransactionLedger'));

    if (!ledgerTransport.current?.device?.opened) {
      await ledgerTransport.current?.device?.open();
    }
    const result = await substrateApp.sign(
      LEDGER_DEFAULT_ACCOUNT + index,
      LEDGER_DEFAULT_CHANGE,
      LEDGER_DEFAULT_INDEX + 0,
      u8aToBuffer(payload.toU8a(true))
    );

    setDefaultMessage(t('signedTransactionSuccessfully'));
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
        body: result.signature,
      };
    }
  };

  // Handle an incoming new status code and persist to state.
  const handleNewStatusCode = (ack: string, statusCode: string) => {
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

  const getDefaultMessage = () => {
    return defaultMessageRef.current;
  };

  const setDefaultMessage = (val: string | null) => {
    setStateWithRef(val, setDefaultMessageState, defaultMessageRef);
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
        getDefaultMessage,
        setDefaultMessage,
        isPaired: isPairedRef.current,
        ledgerAccounts: ledgerAccountsRef.current,
      }}
    >
      {children}
    </LedgerHardwareContext.Provider>
  );
};
