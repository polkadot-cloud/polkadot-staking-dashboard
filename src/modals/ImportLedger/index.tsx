// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, setStateWithRef } from '@w3ux/utils';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import {
  getLedgerApp,
  getLocalLedgerAddresses,
} from 'contexts/LedgerHardware/Utils';
import type {
  LedgerAddress,
  LedgerResponse,
} from 'contexts/LedgerHardware/types';
import type { AnyJson } from '@w3ux/types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useNetwork } from 'contexts/Network';
import { useTranslation } from 'react-i18next';
import { Manage } from './Manage';
import { Splash } from './Splash';
import { NotificationsController } from 'controllers/NotificationsController';
import { useOverlay } from 'kits/Overlay/Provider';

export const ImportLedger: FC = () => {
  const { t } = useTranslation('modals');
  const {
    network,
    networkData: { ss58 },
  } = useNetwork();
  const { setModalResize } = useOverlay().modal;
  const {
    transportResponse,
    resetStatusCode,
    setStatusCode,
    getStatusCode,
    handleUnmount,
    handleGetAddress,
  } = useLedgerHardware();
  const { txMetadataChainId } = getLedgerApp(network);

  // Store addresses retreived from Ledger device. Defaults to local addresses.
  const [addresses, setAddresses] = useState<LedgerAddress[]>(
    getLocalLedgerAddresses(network)
  );
  const addressesRef = useRef(addresses);

  // Gets the next non-imported address index.
  const getNextAddressIndex = () => {
    if (!addressesRef.current.length) {
      return 0;
    }
    return addressesRef.current[addressesRef.current.length - 1].index + 1;
  };

  const onGetAddress = async () => {
    await handleGetAddress(txMetadataChainId, getNextAddressIndex(), ss58);
  };

  const removeLedgerAddress = (address: string) => {
    let newLedgerAddresses = getLocalLedgerAddresses();

    newLedgerAddresses = newLedgerAddresses.filter((a) => {
      if (a.address !== address) {
        return true;
      }
      if (a.network !== network) {
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
    if (!response) {
      return;
    }

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
          if (a.address !== newAddress[0].address) {
            return true;
          }
          if (a.network !== network) {
            return true;
          }
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
      NotificationsController.emit({
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
  useEffect(
    () => () => {
      handleUnmount();
    },
    []
  );

  return !addressesRef.current.length ? (
    <Splash onGetAddress={onGetAddress} />
  ) : (
    <Manage
      addresses={addressesRef.current}
      removeLedgerAddress={removeLedgerAddress}
      onGetAddress={onGetAddress}
    />
  );
};
