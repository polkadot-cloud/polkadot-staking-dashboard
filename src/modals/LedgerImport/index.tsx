// Copyright 2022 @paritytech/polkadot-native authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonSecondary } from '@polkadotcloud/dashboard-ui';
import type { LedgerResponse } from 'contexts/Hardware/types';
import { useModal } from 'contexts/Modal';
import { CustomHeaderWrapper, PaddingWrapper } from 'modals/Wrappers';
import React, { useRef, useState } from 'react';
import type { AnyJson } from 'types';
import { localStorageOrDefault } from 'Utils';
import { Splash } from './Splash';

export const LedgerImport: React.FC = () => {
  const { replaceModalWith } = useModal();
  // Store addresses retreived from Ledger device.
  //
  // TODO: Initialise to any addresses saved in local storage.
  const [addresses] = useState<AnyJson>(
    localStorageOrDefault('ledger_addresses', [], true)
  );
  const addressesRef = useRef(addresses);

  // Store status codes received from Ledger device.
  const [statusCodes] = useState<Array<LedgerResponse>>([]);
  const statusCodesRef = useRef(statusCodes);

  return (
    <PaddingWrapper verticalOnly>
      <CustomHeaderWrapper>
        <h1>
          <ButtonSecondary
            text="Back"
            iconLeft={faChevronLeft}
            iconTransform="shrink-3"
            onClick={() => replaceModalWith('Connect', {}, 'large')}
          />
        </h1>
      </CustomHeaderWrapper>
      {!addressesRef.current.length ? (
        <Splash statusCodes={statusCodesRef.current} />
      ) : (
        <>{/* TODO: Manage Component */}</>
      )}
    </PaddingWrapper>
  );
};
