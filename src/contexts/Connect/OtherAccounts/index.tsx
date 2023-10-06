// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef } from 'react';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
// TODO: move these to utils to the cloud.
import {
  getLocalLedgerAccounts,
  getLocalVaultAccounts,
} from 'contexts/Hardware/Utils';
import { useExtensionAccounts } from '../ExtensionAccounts';
import { useConnect } from '..';
// TODO: move these to utils to the cloud.
import { getLocalExternalAccounts } from '../Utils';

export const OtherAccountsContext = createContext<any>(null);

export const OtherAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { extensionAccountsSynced } = useExtensionAccounts();
  // TODO: move these high level helpers to the cloud.
  const { importLocalAccounts } = useConnect();

  // Store whether hardware accounts have been initialised.
  const hardwareInitialisedRef = useRef<boolean>(false);

  // Store whether all accounts have been initialised.
  const accountsInitialisedRef = useRef<boolean>(false);

  // Once extensions are fully initialised, fetch accounts from other sources.
  useEffectIgnoreInitial(() => {
    if (extensionAccountsSynced) {
      // Fetch accounts from supported hardware wallets.
      importLocalAccounts(getLocalVaultAccounts);
      importLocalAccounts(getLocalLedgerAccounts);

      // Mark hardware wallets as initialised.
      hardwareInitialisedRef.current = true;

      // Finally, fetch any read-only accounts that have been added by `system` or `user`.
      importLocalAccounts(getLocalExternalAccounts);
    }
  }, [extensionAccountsSynced]);

  // Account fetching complete, mark accounts as initialised. Does not include read only accounts.
  useEffectIgnoreInitial(() => {
    if (extensionAccountsSynced && hardwareInitialisedRef.current === true) {
      accountsInitialisedRef.current = true;
    }
  }, [extensionAccountsSynced, hardwareInitialisedRef.current]);

  return { children };
};

export const useOtherAccounts = () => useContext(OtherAccountsContext);
