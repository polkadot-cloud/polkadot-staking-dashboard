// Copyright 2022 @paritytech/polkadot-native authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LedgerResponse } from 'contexts/Hardware/types';
import React, { useRef, useState } from 'react';
import type { AnyJson } from 'types';
import { localStorageOrDefault } from 'Utils';
import { Splash } from './Splash';

export const Import: React.FC = () => {
  // Store addresses retreived from Ledger device.
  //
  // Defaults to addresses saved in local storage. TODO: get device name or somea identifier and
  // group these addresses by that key. Important when managing multiple Ledger devices witin the
  // app.
  const [addresses] = useState<AnyJson>(
    localStorageOrDefault('ledger_addresses', [], true)
  );
  const addressesRef = useRef(addresses);

  // Store status codes received from Ledger device.
  // TODO: map with device identifier (similar in nature to the above TODO).
  const [statusCodes] = useState<Array<LedgerResponse>>([]);
  const statusCodesRef = useRef(statusCodes);

  return (
    <>
      {!addressesRef.current.length ? (
        <Splash statusCodes={statusCodesRef.current} />
      ) : (
        <>{/* TODO: Manage Component */}</>
      )}
    </>
  );
};
