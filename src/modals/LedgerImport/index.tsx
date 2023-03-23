// Copyright 2022 @paritytech/polkadot-native authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { clipAddress, localStorageOrDefault, setStateWithRef } from 'Utils';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import type { LedgerResponse } from 'contexts/Hardware/types';
import { useModal } from 'contexts/Modal';
import { useLedgerLoop } from 'library/Hooks/useLedgerLoop';
import { PaddingWrapper } from 'modals/Wrappers';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyJson } from 'types';
import { Manage } from './Manage';
import { Splash } from './Splash';

export const LedgerImport: React.FC = () => {
  const { setResize } = useModal();
  const {
    transportResponse,
    setIsExecuting,
    resetStatusCodes,
    handleNewStatusCode,
    isPaired,
    getStatusCodes,
    setDefaultMessage,
    getTransport,
  } = useLedgerHardware();

  // Gets the next non-imported address index.
  const getNextAddressIndex = () => {
    if (!addressesRef.current.length) {
      return 0;
    }
    return addressesRef.current[addressesRef.current.length - 1].index + 1;
  };

  // Ledger loop needs to keep track of whether this component is mounted. If it is unmounted then
  // the loop will cancel & ledger metadata will be cleared up. isMounted needs to be given as a
  // function so the interval fetches the real value.
  const isMounted = useRef(true);
  const getIsMounted = () => isMounted.current;

  const { handleLedgerLoop } = useLedgerLoop({
    tasks: ['get_address'],
    options: {
      accountIndex: getNextAddressIndex,
    },
    mounted: getIsMounted,
  });

  // Store addresses retreived from Ledger device.
  const [addresses, setAddresses] = useState<AnyJson>(
    localStorageOrDefault('ledger_addresses', [], true)
  );
  const addressesRef = useRef(addresses);

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

      setIsExecuting(false);
      setStateWithRef(newAddresses, setAddresses, addressesRef);
      resetStatusCodes();
    }
  };

  // Resize modal on content change.
  useEffect(() => {
    setResize();
  }, [isPaired, getStatusCodes(), addressesRef.current]);

  // Listen for new Ledger status reports.
  useEffect(() => {
    handleLedgerStatusResponse(transportResponse);
  }, [transportResponse]);

  // Tidy up context state when this component is no longer mounted.
  useEffect(() => {
    return () => {
      isMounted.current = false;
      resetStatusCodes();
      setIsExecuting(false);
      setDefaultMessage(null);
      if (getTransport()?.device?.opened) {
        getTransport().device.close();
      }
    };
  }, []);

  return (
    <PaddingWrapper verticalOnly>
      {!addressesRef.current.length ? (
        <Splash handleLedgerLoop={handleLedgerLoop} />
      ) : (
        <Manage
          addresses={addressesRef.current}
          handleLedgerLoop={handleLedgerLoop}
        />
      )}
    </PaddingWrapper>
  );
};
