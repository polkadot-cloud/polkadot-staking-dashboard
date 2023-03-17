// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Polkadot from '@ledgerhq/hw-app-polkadot';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { useApi } from 'contexts/Api';
import type { LedgerAccount } from 'contexts/Connect/types';
import React, { useRef, useState } from 'react';
import type { AnyFunction, AnyJson } from 'types';
import { clipAddress, localStorageOrDefault, setStateWithRef } from 'Utils';
import { defaultLedgerHardwareContext } from './defaults';
import type {
  LedgerHardwareContextInterface,
  LedgerResponse,
  LedgerTask,
  PairingStatus,
} from './types';

export const TOTAL_ALLOWED_STATUS_CODES = 50;

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
  const { network } = useApi();

  // Store whether the device has been paired.
  const [isPaired, setIsPairedState] = useState<PairingStatus>('unknown');
  const isPairedRef = useRef(isPaired);

  // Store whether an import is in process.
  const [isImporting, setIsImportingState] = useState(false);
  const isImportingRef = useRef(isImporting);

  // Store status codes received from Ledger device.
  const [statusCodes, setStatusCodes] = useState<Array<LedgerResponse>>([]);
  const statusCodesRef = useRef(statusCodes);

  // Store the latest successful response from an attempted `executeLedgerLoop`.
  const [transportResponse, setTransportResponse] = useState<AnyJson>(null);

  // Store the imported ledger accounts.
  const initialLedgerAccounts = localStorageOrDefault(
    'imported_addresses',
    [],
    true
  ) as Array<LedgerAccount>;
  const [ledgerAccounts, setLedgerAccountsState] = useState<
    Array<LedgerAccount>
  >(initialLedgerAccounts);
  const ledgerAccountsRef = useRef(ledgerAccounts);

  // The ledger transport interface.
  const t = useRef<any>(null);

  // Check whether the device is paired.
  //
  // Trigger a one-time connection to the device to determine if it is available. If the device
  // needs to be paired, a browser prompt will pop up and initialisation of `transport` will hault
  // until the user has completed or cancelled the pairing process.
  const pairDevice = async () => {
    try {
      resetStatusCodes();
      // close any open connections.
      if (t.current?.device?.opened) {
        await t.current?.device?.close();
      }
      // establish a new connection with device.
      t.current = await TransportWebHID.create();
      setIsPaired('paired');
      return true;
    } catch (err) {
      return false;
    }
  };

  // Handles errors that occur during a `executeLedgerLoop`.
  const handleErrors = (err: AnyJson) => {
    if (
      String(err).startsWith('DOMException: Failed to open the device.') ||
      String(err).startsWith('NotAllowedError: Failed to open the device.') ||
      String(err).startsWith('TransportOpenUserCancelled') ||
      String(err).startsWith('TypeError')
    ) {
      handleNewStatusCode('failure', 'DeviceNotConnected');
    } else if (
      String(err).startsWith('TransportError: Ledger Device is busy')
    ) {
      // do nothing
    } else if (String(err).startsWith('TransportStatusError')) {
      handleNewStatusCode('failure', 'OpenAppToContinue');
    } else {
      handleNewStatusCode('failure', 'AppNotOpen');
    }
  };

  // Connects to a Ledger device to perform a task.
  const executeLedgerLoop = async (
    transport: AnyJson,
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => {
    try {
      let result = null;
      if (tasks.includes('get_address')) {
        result = await handleGetAddress(transport, options.accountIndex ?? 0);
        if (result) {
          setTransportResponse({
            ack: 'success',
            options,
            ...result,
          });
        }
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  // Timeout function for hanging tasks.
  const withTimeout = (millis: AnyFunction, promise: AnyFunction) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(Error()), millis)
    );
    return Promise.race([promise, timeout]);
  };

  // Gets a Polkadot address on device.
  const handleGetAddress = async (transport: AnyJson, accountIndex: number) => {
    const polkadot = new Polkadot(transport);
    const { deviceModel } = transport;
    const { id, productName } = deviceModel;

    setTransportResponse({
      ack: 'success',
      statusCode: 'GettingAddress',
      body: `Getting addresess ${accountIndex} in progress.`,
    });

    const address = await withTimeout(
      5000,
      polkadot.getAddress(`'44'/354'/${accountIndex}'/0'/0'`, false)
    );

    if (!(address instanceof Error)) {
      return {
        statusCode: 'ReceivedAddress',
        device: { id, productName },
        body: [address],
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
  const ledgerAccountExists = (address: string) => {
    const imported = localStorageOrDefault(
      'ledger_accounts',
      [],
      true
    ) as Array<LedgerAccount>;
    return !!imported.find((a: LedgerAccount) => a.address === address);
  };

  const addLedgerAccount = (address: string) => {
    let newImported = localStorageOrDefault(
      'ledger_accounts',
      [],
      true
    ) as Array<LedgerAccount>;

    if (!newImported.find((a: LedgerAccount) => a.address === address)) {
      const account = {
        address,
        network: network.name,
        name: clipAddress(address), // TODO: refer to `ledger_address.name` instead.
        source: 'ledger',
      };
      newImported = [...newImported].concat(account);
      localStorage.setItem('ledger_accounts', JSON.stringify(newImported));
      setStateWithRef(newImported, setLedgerAccountsState, ledgerAccountsRef);

      return account;
    }
    return null;
  };

  const removeLedgerAccount = (address: string) => {
    let newImported = localStorageOrDefault(
      'ledger_accounts',
      [],
      true
    ) as Array<LedgerAccount>;

    newImported = newImported.filter(
      (a: LedgerAccount) => a.address !== address
    );
    localStorage.setItem('ledger_accounts', JSON.stringify(newImported));
    setStateWithRef(newImported, setLedgerAccountsState, ledgerAccountsRef);
  };

  // Gets an imported address along with its Ledger metadata.
  const getLedgerAccount = (address: string) => {
    const imported = localStorageOrDefault(
      'ledger_accounts',
      [],
      true
    ) as Array<LedgerAccount>;

    if (!imported) {
      return null;
    }
    return imported.find((a: LedgerAccount) => a.address === address) ?? null;
  };

  const setIsPaired = (p: PairingStatus) => {
    setStateWithRef(p, setIsPairedState, isPairedRef);
  };

  const setIsImporting = (val: boolean) => {
    setStateWithRef(val, setIsImportingState, isImportingRef);
  };

  const cancelImport = () => {
    setIsImporting(false);
    resetStatusCodes();
  };

  const resetStatusCodes = () => {
    setStateWithRef([], setStatusCodes, statusCodesRef);
  };

  const getIsImporting = () => {
    return isImportingRef.current;
  };

  const getStatusCodes = () => {
    return statusCodesRef.current;
  };

  const getTransport = () => {
    return t.current;
  };

  return (
    <LedgerHardwareContext.Provider
      value={{
        pairDevice,
        transportResponse,
        executeLedgerLoop,
        setIsPaired,
        setIsImporting,
        cancelImport,
        handleNewStatusCode,
        resetStatusCodes,
        getIsImporting,
        getStatusCodes,
        handleErrors,
        isPaired: isPairedRef.current,
        getTransport,
        ledgerAccountExists,
        addLedgerAccount,
        removeLedgerAccount,
        getLedgerAccount,
      }}
    >
      {children}
    </LedgerHardwareContext.Provider>
  );
};
