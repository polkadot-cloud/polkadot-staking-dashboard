// Copyright 2022 @paritytech/polkadot-native authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, setStateWithRef } from '@polkadot-cloud/utils';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLedgerHardware } from 'contexts/Hardware/Ledger/LedgerHardware';
import { getLedgerApp, getLocalLedgerAddresses } from 'contexts/Hardware/Utils';
import type {
  LedgerAddress,
  LedgerResponse,
} from 'contexts/Hardware/Ledger/types';
import type { AnyJson } from 'types';
import {
  useEffectIgnoreInitial,
  useOverlay,
} from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useNotifications } from 'contexts/Notifications';
import { useTranslation } from 'react-i18next';
import { Manage } from './Manage';
import { Splash } from './Splash';

export const ImportLedger: FC = () => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { setModalResize } = useOverlay().modal;
  const {
    transportResponse,
    resetStatusCode,
    setStatusCode,
    getStatusCode,
    handleUnmount,
    handleGetAddress,
  } = useLedgerHardware();
  const { addNotification } = useNotifications();
  const { appName } = getLedgerApp(network);

  // Store addresses retreived from Ledger device. Defaults to local addresses.
  const [addresses, setAddresses] = useState<LedgerAddress[]>(
    getLocalLedgerAddresses(network)
  );
  const addressesRef = useRef(addresses);

  // Gets the next non-imported address index.
  const getNextAddressIndex = () => {
    if (!addressesRef.current.length) return 0;
    return addressesRef.current[addressesRef.current.length - 1].index + 1;
  };

  const onGetAddress = async () => {
    await handleGetAddress(appName, getNextAddressIndex());
  };

  const removeLedgerAddress = (address: string) => {
    let newLedgerAddresses = getLocalLedgerAddresses();

    newLedgerAddresses = newLedgerAddresses.filter((a) => {
      if (a.address !== address) return true;
      if (a.network !== network) return true;
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
      newLedgerAddresses.filter((a: LedgerAddress) => a.network === network),
      setAddresses,
      addressesRef
    );
  };

  // refresh imported ledger accounts on network change.
  useEffect(() => {
    setStateWithRef(
      getLocalLedgerAddresses(network),
      setAddresses,
      addressesRef
    );
  }, [network]);

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) return;

    const { ack, statusCode, body, options } = response;
    setStatusCode(ack, statusCode);

    if (statusCode === 'ReceivedAddress') {
      const newAddress = body.map(({ pubKey, address }: LedgerAddress) => ({
        index: options.accountIndex,
        pubKey,
        address,
        name: ellipsisFn(address),
        network,
      }));

      // update the full list of local ledger addresses with new entry.
      const newAddresses = getLocalLedgerAddresses()
        .filter((a: AnyJson) => {
          if (a.address !== newAddress[0].address) return true;
          if (a.network !== network) return true;
          return false;
        })
        .concat(newAddress);
      localStorage.setItem('ledger_addresses', JSON.stringify(newAddresses));

      // store only those accounts on the current network in state.
      setStateWithRef(
        newAddresses.filter((a) => a.network === network),
        setAddresses,
        addressesRef
      );
      resetStatusCode();

      // trigger notification.
      addNotification({
        title: t('ledgerAccountFetched'),
        subtitle: t('ledgerFetchedAccount', {
          account: ellipsisFn(newAddress[0].address),
        }),
      });
    }
  };

  // Resize modal on content change.
  useEffect(() => {
    setModalResize();
  }, [getStatusCode(), addressesRef.current]);

  // Listen for new Ledger status reports.
  useEffectIgnoreInitial(() => {
    handleLedgerStatusResponse(transportResponse);
  }, [transportResponse]);

  // Tidy up context state when this component is no longer mounted.
  useEffect(() => {
    return () => {
      handleUnmount();
    };
  }, []);

  return (
    <>
      {!addressesRef.current.length ? (
        <Splash onGetAddress={onGetAddress} />
      ) : (
        <Manage
          addresses={addressesRef.current}
          removeLedgerAddress={removeLedgerAddress}
          onGetAddress={onGetAddress}
        />
      )}
    </>
  );
};
