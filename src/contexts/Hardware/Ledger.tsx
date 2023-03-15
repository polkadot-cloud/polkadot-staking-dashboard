// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Polkadot from '@ledgerhq/hw-app-polkadot';
import React, { useRef, useState } from 'react';
import type { AnyJson } from 'types';
import { setStateWithRef } from 'Utils';
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
  // Store whether the device has been paired.
  const [isPaired, setIsPairedState] = useState<PairingStatus>('unknown');
  const isPairedRef = useRef(isPaired);

  // Store whether an import is in process.
  const [isImporting, setIsImportingState] = useState(false);
  const isImportingRef = useRef(isImporting);

  // Store status codes received from Ledger device.
  const [statusCodes, setStatusCodes] = useState<Array<LedgerResponse>>([]);
  const statusCodesRef = useRef(statusCodes);

  // Store the latest ledger device info.
  const [ledgerDeviceInfo] = useState<AnyJson>(null);

  // Store the latest successful response from an attempted `executeLedgerLoop`.
  const [transportResponse, setTransportResponse] = useState<AnyJson>(null);

  const t = useRef<any>(null);

  // Handles errors that occur during a `executeLedgerLoop`.
  const handleErrors = (err: AnyJson) => {
    if (
      String(err).startsWith('DOMException: Failed to open the device.') ||
      String(err).startsWith('NotAllowedError: Failed to open the device.')
    ) {
      handleNewStatusCode('failure', 'DeviceNotConnected');
    } else if (String(err).startsWith('TransportOpenUserCancelled')) {
      handleNewStatusCode('failure', 'DeviceNotConnected');
    } else if (String(err).startsWith('TypeError')) {
      handleNewStatusCode('failure', 'DeviceNotConnected');
    } else if (
      String(err).startsWith('TransportError: Ledger Device is busy')
    ) {
      // do nothing.
    } else {
      handleNewStatusCode('failure', 'AppNotOpen');
    }
    // DOMException: The device is already open.
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

  // Gets a Polkadot address on the device.
  const handleGetAddress = async (transport: AnyJson, accountIndex: number) => {
    const polkadot = new Polkadot(transport);
    const { deviceModel } = transport;
    const { id, productName } = deviceModel;

    setTransportResponse({
      ack: 'success',
      statusCode: 'GettingAddress',
      body: `Getting addresess ${accountIndex} in progress.`,
    });

    const address = await polkadot.getAddress(
      `44'/354'/${accountIndex}'/0/0`,
      false
    );

    return {
      statusCode: 'ReceivedAddress',
      device: { id, productName },
      body: [address],
    };
  };

  // Handle an incoming new status code and persists to state.
  //
  // The most recent status code is stored at the start of the array at index 0. If total status
  // codes are larger than the maximum allowed, the status code array is popped.
  const handleNewStatusCode = (ack: string, statusCode: string) => {
    const newStatusCodes = [{ ack, statusCode }, ...statusCodes];

    // Remove last status code if there are more than allowed number of status codes.
    if (newStatusCodes.length > TOTAL_ALLOWED_STATUS_CODES) {
      newStatusCodes.pop();
    }
    setStateWithRef(newStatusCodes, setStatusCodes, statusCodesRef);
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

  return (
    <LedgerHardwareContext.Provider
      value={{
        ledgerDeviceInfo,
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
        transport: t,
      }}
    >
      {children}
    </LedgerHardwareContext.Provider>
  );
};
