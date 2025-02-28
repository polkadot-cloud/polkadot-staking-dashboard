// Copyright 2022 @paritytech/polkadot-native authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { clipAddress, registerSaEvent, setStateWithRef } from 'Utils';
import { useApi } from 'contexts/Api';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLocalLedgerAddresses } from 'contexts/Hardware/Utils';
import type { LedgerAddress, LedgerResponse } from 'contexts/Hardware/types';
import { useModal } from 'contexts/Modal';
import { useLedgerLoop } from 'library/Hooks/useLedgerLoop';
import { PaddingWrapper } from 'modals/Wrappers';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyJson } from 'types';
import { Manage } from './Manage';
import { Splash } from './Splash';

export const LedgerImport: React.FC = () => {
  const { network } = useApi();
  const { setResize } = useModal();
  const {
    transportResponse,
    getIsExecuting,
    setIsExecuting,
    resetStatusCodes,
    handleNewStatusCode,
    isPaired,
    getStatusCodes,
    handleUnmount,
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

  // Store addresses retreived from Ledger device. Defaults to local addresses.
  const [addresses, setAddresses] = useState<Array<LedgerAddress>>(
    getLocalLedgerAddresses(network.name)
  );
  const addressesRef = useRef(addresses);

  const removeLedgerAddress = (address: string) => {
    let newLedgerAddresses = getLocalLedgerAddresses();

    newLedgerAddresses = newLedgerAddresses.filter((a: LedgerAddress) => {
      if (a.address !== address) {
        return true;
      }
      if (a.network !== network.name) {
        return true;
      }
      return false;
    });
    if (!newLedgerAddresses.length) {
      localStorage.removeItem('ledger_addresses');
    } else {
      localStorage.setItem(
        'ledger_addresses',
        JSON.stringify(newLedgerAddresses)
      );
    }
    setStateWithRef(
      newLedgerAddresses.filter(
        (a: LedgerAddress) => a.network === network.name
      ),
      setAddresses,
      addressesRef
    );
  };

  // refresh imported ledger accounts on network change.
  useEffect(() => {
    setStateWithRef(
      getLocalLedgerAddresses(network.name),
      setAddresses,
      addressesRef
    );
  }, [network]);

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) return;

    const { ack, statusCode, body, options } = response;
    handleNewStatusCode(ack, statusCode);

    if (statusCode === 'ReceivedAddress') {
      const newAddress = body.map(({ pubKey, address }: LedgerAddress) => ({
        index: options.accountIndex,
        pubKey,
        address,
        name: clipAddress(address),
        network: network.name,
      }));

      // update the full list of local ledger addresses with new entry.
      const newAddresses = getLocalLedgerAddresses()
        .filter((a: AnyJson) => {
          if (a.address !== newAddress.address) {
            return true;
          }
          if (a.network !== network.name) {
            return true;
          }
          return false;
        })
        .concat(newAddress);
      localStorage.setItem('ledger_addresses', JSON.stringify(newAddresses));

      setIsExecuting(false);

      // store only those accounts on the current network in state.
      setStateWithRef(
        newAddresses.filter((a: LedgerAddress) => a.network === network.name),
        setAddresses,
        addressesRef
      );
      resetStatusCodes();

      registerSaEvent(`${network.name.toLowerCase()}_ledger_account_fetched`);
    }
  };

  // Resize modal on content change.
  useEffect(() => {
    setResize();
  }, [isPaired, getStatusCodes(), addressesRef.current]);

  // Listen for new Ledger status reports.
  useEffect(() => {
    if (getIsExecuting()) {
      handleLedgerStatusResponse(transportResponse);
    }
  }, [transportResponse]);

  // Tidy up context state when this component is no longer mounted.
  useEffect(() => {
    return () => {
      isMounted.current = false;
      handleUnmount();
    };
  }, []);

  return (
    <PaddingWrapper verticalOnly>
      {!addressesRef.current.length ? (
        <Splash handleLedgerLoop={handleLedgerLoop} />
      ) : (
        <Manage
          addresses={addressesRef.current}
          removeLedgerAddress={removeLedgerAddress}
          handleLedgerLoop={handleLedgerLoop}
        />
      )}
    </PaddingWrapper>
  );
};
