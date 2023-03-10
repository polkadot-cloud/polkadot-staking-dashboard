// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Polkadot from '@ledgerhq/hw-app-polkadot';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import React, { useState } from 'react';
import type { AnyJson } from 'types';
import { defaultLedgerHardwareContext } from './defaults';
import type {
  LedgerHardwareContextInterface,
  LedgerResponse,
  LedgerTask,
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
  // Store the latest transport error of an attempted `executeLedgerLoop`.
  const [transportError, setTransportError] = useState<LedgerResponse | null>(
    null
  );

  // Store the latest ledger device info.
  const [ledgerDeviceInfo, setLedgerDeviceInfo] = useState<AnyJson>(null);

  // Store the latest successful response from an attempted `executeLedgerLoop`.
  // TODO: migrate into an array of statuses.
  const [transportResponse, setTransportResponse] = useState<AnyJson>(null);

  // Handles errors that occur during a `executeLedgerLoop`.
  const handleErrors = (err: AnyJson) => {
    if (err?.id === 'NoDevice') {
      setTransportError({
        ack: 'failure',
        statusCode: 'DeviceNotConnected',
      });
    } else {
      setTransportError({
        ack: 'failure',
        statusCode: 'AppNotOpen',
      });
    }
  };

  // Connects to a Ledger device to perform a task.
  const executeLedgerLoop = async (
    tasks: Array<LedgerTask>,
    options?: AnyJson
  ) => {
    let transport;
    let noDevice = false;

    if (tasks.includes('get_device_info')) {
      try {
        transport = await TransportWebUSB.create();
        const { deviceModel } = transport;
        if (deviceModel) {
          const { id, productName } = deviceModel;
          setLedgerDeviceInfo({
            id,
            productName,
          });
        }
        transport.close();
      } catch (err) {
        transport = null;
        noDevice = true;
        handleErrors(err);
      }
    }

    if (!noDevice) {
      try {
        transport = await TransportWebUSB.create();
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
        transport.close();
      } catch (err) {
        transport = null;
        handleErrors(err);
      }
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
      `'44'/354'/${accountIndex}'/0'/0'`,
      false
    );
    return {
      statusCode: 'ReceivedAddress',
      device: { id, productName },
      body: [address],
    };
  };
  return (
    <LedgerHardwareContext.Provider
      value={{
        transportError,
        ledgerDeviceInfo,
        transportResponse,
        executeLedgerLoop,
      }}
    >
      {children}
    </LedgerHardwareContext.Provider>
  );
};
