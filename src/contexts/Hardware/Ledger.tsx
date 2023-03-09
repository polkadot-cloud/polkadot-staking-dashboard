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

  const handleErrors = (err: AnyJson) => {
    // Handle Ledger connection errors.
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

    // Attempt to store the device model.
    if (tasks.includes('get_device_info')) {
      try {
        transport = await TransportWebUSB.create();
        // const { deviceModel } = transport;
        const deviceModel = null;
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

    // Attempt to carry out desired tasks.
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

  // Gets a Polkadot addresses on the device.
  const handleGetAddress = async (transport: AnyJson, accountIndex: number) => {
    const polkadot = new Polkadot(transport);
    const { deviceModel } = transport;
    const { id, productName } = deviceModel;

    setTransportResponse({
      ack: 'success',
      statusCode: 'GettingAddress',
      body: `Getting addresess ${accountIndex} in prgress.`,
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
    // return {};
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
