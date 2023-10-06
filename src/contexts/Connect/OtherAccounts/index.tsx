// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
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
import type { OtherAccountsContextInterface } from './types';
import { defaultOtherAccountsContext } from './defaults';

// TODO: provide other accounts through this provider.
export const OtherAccountsContext =
  createContext<OtherAccountsContextInterface>(defaultOtherAccountsContext);

export const OtherAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { extensionAccountsSynced } = useExtensionAccounts();
  // TODO: move these high level helpers to the cloud.
  const { importLocalAccounts } = useConnect();

  // Store whether other (non-extension) accounts have been initialised.
  const [otherAccountsSynced, setOtherAccountsSynced] =
    useState<boolean>(false);

  // Store whether all accounts have been synced.
  // TODO: move to a context that provides getters to all accounts.
  const [accountsInitialised, setAccountsInitialised] =
    useState<boolean>(false);

  // Once extensions are fully initialised, fetch accounts from other sources.
  useEffectIgnoreInitial(() => {
    if (extensionAccountsSynced) {
      // Fetch accounts from supported hardware wallets.
      importLocalAccounts(getLocalVaultAccounts);
      importLocalAccounts(getLocalLedgerAccounts);

      // Mark hardware wallets as initialised.
      setOtherAccountsSynced(true);

      // Finally, fetch any read-only accounts that have been added by `system` or `user`.
      importLocalAccounts(getLocalExternalAccounts);
    }
  }, [extensionAccountsSynced]);

  // Account fetching complete, mark accounts as initialised. Does not include read only accounts.
  useEffectIgnoreInitial(() => {
    if (extensionAccountsSynced && otherAccountsSynced === true) {
      setAccountsInitialised(true);
    }
  }, [extensionAccountsSynced, otherAccountsSynced]);

  return (
    <OtherAccountsContext.Provider
      value={{
        accountsInitialised,
      }}
    >
      {children}
    </OtherAccountsContext.Provider>
  );
};

export const useOtherAccounts = () => useContext(OtherAccountsContext);
