// Copyright 2022 @paritytech/polkadot-native authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
    pairDevice,
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
    getTransport,
  } = useLedgerHardware();

  // Store whether this component is mounted.
  const isMounted = useRef(false);

  // Store addresses retreived from Ledger device.
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

  // Connect to Ledger device and perform necessary tasks.
  //
  // The tasks sent to the device depend on the current state of the import process. The interval is
  // cleared once the address has been successfully fetched.
  let interval: ReturnType<typeof setInterval>;
  const handleLedgerLoop = () => {
    interval = setInterval(async () => {
      // If the import modal is no longer open, cancel interval and reset import state.
      if (!isMounted.current) {
        clearInterval(interval);
        return;
      }

      // If the device is not connected, cancel execution but keep interval active.
      if (['DeviceNotConnected'].includes(getStatusCodes()[0]?.statusCode)) {
        setIsPaired('unpaired');
        clearInterval(interval);
        return;
      }

      // If the app is not open on the device, cancel execution and interval until the user tries
      // again.
      if (
        ['OpenAppToContinue', 'AppNotOpen'].includes(
          getStatusCodes()[0]?.statusCode
        )
      ) {
        setIsPaired('unpaired');
        setIsImporting(false);
        clearInterval(interval);
        return;
      }

      // Attempt to carry out tasks on-device.
      try {
        if (!getTransport().device.opened) {
          await getTransport().device.open();
        }
        const tasks: Array<LedgerTask> = [];
        if (getIsImporting()) {
          tasks.push('get_address');
        }
        await executeLedgerLoop(getTransport(), tasks, {
          accountIndex: getNextAddressIndex(),
        });
      } catch (err) {
        handleErrors(err);
      }
    }, 750);
  };

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) return;
    clearInterval(interval);

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

  // Keep `isMounted` up to date and tidy up context state when ledger import window closes.
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      resetStatusCodes();
      setIsImporting(false);
      if (getTransport()?.device?.opened) {
        getTransport().device.close();
      }
    };
  }, []);

  // Resize modal on content change.
  useEffect(() => {
    setResize();
  }, [isPaired, getStatusCodes(), addressesRef.current]);

  // Listen for new Ledger status reports.
  useEffect(() => {
    if (getIsImporting()) {
      handleLedgerStatusResponse(transportResponse);
    }
  }, [transportResponse]);

  return (
    <PaddingWrapper verticalOnly>
      {!addressesRef.current.length ? (
        <Splash pairDevice={pairDevice} handleLedgerLoop={handleLedgerLoop} />
      ) : (
        <Manage
          addresses={addressesRef.current}
          handleLedgerLoop={handleLedgerLoop}
        />
      )}
    </PaddingWrapper>
  );
};
