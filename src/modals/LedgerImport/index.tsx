// Copyright 2022 @paritytech/polkadot-native authors & contributors
// SPDX-License-Identifier: Apache-2.0

import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import type { LedgerResponse, LedgerTask } from 'contexts/Hardware/types';
import { useModal } from 'contexts/Modal';
import { PaddingWrapper } from 'modals/Wrappers';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyJson } from 'types';
import { clipAddress, localStorageOrDefault, setStateWithRef } from 'Utils';
import { Manage } from './Manage';
import { Splash } from './Splash';

export const LedgerImport: React.FC = () => {
  const { setResize } = useModal();
  const {
    executeLedgerLoop,
    transportResponse,
    setIsPaired,
    setIsImporting,
    resetStatusCodes,
    getIsImporting,
    handleNewStatusCode,
    isPaired,
    getStatusCodes,
    handleErrors,
    transport,
  } = useLedgerHardware();

  // Store whether this component is mounted.
  const isMounted = useRef(false);

  // Store addresses retreived from Ledger device.
  //
  // TODO: Initialise to any addresses saved in local storage.
  const [addresses, setAddresses] = useState<AnyJson>(
    localStorageOrDefault('ledger_addresses', [], true)
  );
  const addressesRef = useRef(addresses);

  // Gets the next non-imported address index.
  const getNextAddressIndex = () => {
    if (!addressesRef.current.length) {
      return 0;
    }
    return addressesRef.current[addressesRef.current.length - 1].index + 1;
  };

  // Check whether the device is paired.
  //
  // Trigger a one-time connection to the device to determine if it is available. If the device
  // needs to be paired, a browser prompt will pop up and initialisation of `transport` will hault
  // until the user has completed or cancelled the pairing process.
  const pairDevice = async () => {
    try {
      resetStatusCodes();
      transport.current = await TransportWebHID.create();
      await transport.current.device.close();
      setIsPaired('paired');
    } catch (err) {
      setIsPaired('unpaired');
    }
  };

  // Connect to Ledger device and perform necessary tasks.
  //
  // The tasks sent to the device depend on the current state of the import process. The interval is
  // cleared once the address has been successfully fetched.
  let interval: ReturnType<typeof setInterval>;
  const handleLedgerLoop = () => {
    const clearLoop = () => {
      clearInterval(interval);
    };

    interval = setInterval(async () => {
      if (getStatusCodes()[0]?.statusCode === 'DeviceNotConnected') {
        setIsPaired('unpaired');
        clearLoop();
        return;
      }
      if (!isMounted.current) {
        resetStatusCodes();
        clearLoop();
        return;
      }

      try {
        if (!transport.current.device.opened) {
          await transport.current.device.open();
        }
        const tasks: Array<LedgerTask> = ['get_device_info'];
        if (getIsImporting()) {
          tasks.push('get_address');
        }
        await executeLedgerLoop(transport.current, tasks, {
          accountIndex: getNextAddressIndex(),
        });
        await transport.current.device.close();
      } catch (err) {
        handleErrors(err);
      }
    }, 2000);
  };

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) return;

    const { ack, statusCode, body, options } = response;
    handleNewStatusCode(ack, statusCode);

    if (statusCode === 'ReceivedAddress') {
      const addressFormatted = body.map(({ pubKey, address }: AnyJson) => ({
        index: options.accountIndex,
        pubKey,
        address,
        name: clipAddress(address),
      }));

      const newAddresses = addressesRef.current
        .filter((a: AnyJson) => a.address !== addressFormatted.address)
        .concat(addressFormatted);

      localStorage.setItem('ledger_addresses', JSON.stringify(newAddresses));

      setIsImporting(false);
      setStateWithRef(newAddresses, setAddresses, addressesRef);
      resetStatusCodes();
    }
  };

  // Initialise listeners for Ledger IO.
  useEffect(() => {
    if (isPaired !== 'paired') {
      pairDevice();
    }
  }, [isPaired]);

  // Once the device is paired, start `handleLedgerLoop`.
  useEffect(() => {
    if (isPaired === 'paired') {
      if (!addressesRef.current.length) {
        setIsImporting(true);
        handleLedgerLoop();
      }
    }
  }, [isPaired]);

  // Keep `isMounted` up to date.
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Resize modal on content change
  useEffect(() => {
    setResize();
  }, [isPaired, getStatusCodes()]);

  // Listen for new Ledger status reports.
  useEffect(() => {
    handleLedgerStatusResponse(transportResponse);
  }, [transportResponse]);

  return (
    <PaddingWrapper verticalOnly>
      {!addressesRef.current.length ? (
        <Splash pairDevice={pairDevice} />
      ) : (
        <Manage addresses={addressesRef.current} />
      )}
    </PaddingWrapper>
  );
};
