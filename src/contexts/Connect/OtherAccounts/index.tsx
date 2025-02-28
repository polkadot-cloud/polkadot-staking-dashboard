// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  getLocalLedgerAccounts,
  getLocalVaultAccounts,
} from 'contexts/Hardware/Utils';
import type { MaybeAddress, NetworkName } from 'types';
import { setStateWithRef } from '@w3ux/utils';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { getActiveAccountLocal } from '../Utils';
import type { OtherAccountsContextInterface } from './types';
import { defaultOtherAccountsContext } from './defaults';
import { getLocalExternalAccounts } from '../ExternalAccounts/Utils';
import type { ExternalAccountImportType } from '../ExternalAccounts/types';
import { isCustomEvent } from 'static/utils';
import { useExternalAccounts } from '../ExternalAccounts';
import { useEventListener } from 'usehooks-ts';
import { useExtensionAccounts, useExtensions } from '@w3ux/react-connect-kit';
import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';

export const OtherAccountsContext =
  createContext<OtherAccountsContextInterface>(defaultOtherAccountsContext);

export const useOtherAccounts = () => useContext(OtherAccountsContext);

export const OtherAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    network,
    networkData: { ss58 },
  } = useNetwork();
  const { checkingInjectedWeb3 } = useExtensions();
  const { addExternalAccount } = useExternalAccounts();
  const { extensionAccountsSynced } = useExtensionAccounts();
  const { activeAccount, setActiveAccount } = useActiveAccounts();

  // Store whether other (non-extension) accounts have been initialised.
  const [otherAccountsSynced, setOtherAccountsSynced] =
    useState<boolean>(false);

  // Store other (non-extension) accounts list.
  const [otherAccounts, setOtherAccounts] = useState<ImportedAccount[]>([]);
  // Ref is needed to refer to updated state in-between renders as local accounts are imported from
  // different sources.
  const otherAccountsRef = useRef(otherAccounts);

  // Store whether all accounts have been synced.
  const [accountsInitialised, setAccountsInitialised] =
    useState<boolean>(false);

  // Handle forgetting of an imported other account.
  const forgetOtherAccounts = (forget: ImportedAccount[]) => {
    if (forget.length) {
      // Remove forgotten accounts from context state.
      setStateWithRef(
        [...otherAccountsRef.current].filter(
          (a) =>
            forget.find(({ address }) => address === a.address) === undefined
        ),
        setOtherAccounts,
        otherAccountsRef
      );
      // If the currently active account is being forgotten, disconnect.
      if (
        forget.find(({ address }) => address === activeAccount) !== undefined
      ) {
        setActiveAccount(null);
      }
    }
  };

  // Checks `localStorage` for previously added accounts from the provided source, and adds them to
  // `accounts` state. if local active account is present, it will also be assigned as active.
  // Accounts are ignored if they are already imported through an extension.
  const importLocalOtherAccounts = (
    getter: (n: NetworkName) => ImportedAccount[]
  ) => {
    // Get accounts from provided `getter` function. The resulting array of accounts must contain an
    // `address` field.
    let localAccounts = getter(network);

    if (localAccounts.length) {
      const activeAccountInSet =
        localAccounts.find(
          ({ address }) => address === getActiveAccountLocal(network, ss58)
        ) ?? null;

      // remove already-imported accounts.
      localAccounts = localAccounts.filter(
        (l) =>
          otherAccountsRef.current.find(
            ({ address }) => address === l.address
          ) === undefined
      );

      // set active account for networkData.
      if (activeAccountInSet) {
        setActiveAccount(activeAccountInSet.address);
      }

      // add accounts to imported.
      addOtherAccounts(localAccounts);
    }
  };

  // Renames an other account.
  const renameOtherAccount = (address: MaybeAddress, newName: string) => {
    setStateWithRef(
      [...otherAccountsRef.current].map((a) =>
        a.address !== address
          ? a
          : {
              ...a,
              name: newName,
            }
      ),
      setOtherAccounts,
      otherAccountsRef
    );
  };

  // Add other accounts to context state.
  const addOtherAccounts = (account: ImportedAccount[]) => {
    setStateWithRef(
      [...otherAccountsRef.current].concat(account),
      setOtherAccounts,
      otherAccountsRef
    );
  };

  // Replace other account with new entry.
  const replaceOtherAccount = (account: ImportedAccount) => {
    setStateWithRef(
      [...otherAccountsRef.current].map((item) =>
        item.address !== account.address ? item : account
      ),
      setOtherAccounts,
      otherAccountsRef
    );
  };

  // Add or replace other account with an entry.
  const addOrReplaceOtherAccount = (
    account: ImportedAccount,
    type: ExternalAccountImportType
  ) => {
    if (type === 'new') {
      addOtherAccounts([account]);
    } else if (type === 'replace') {
      replaceOtherAccount(account);
    }
  };

  // Handle new external account custom events.
  const newExternalAccountCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const result = addExternalAccount(e.detail.address, 'system');
      if (result) {
        addOrReplaceOtherAccount(result.account, result.type);
      }
    }
  };

  // Listen for new external account events.
  const documentRef = useRef<Document>(document);
  useEventListener(
    'new-external-account',
    newExternalAccountCallback,
    documentRef
  );

  // Re-sync other accounts on network switch. Waits for `injectedWeb3` to be injected.
  useEffect(() => {
    if (!checkingInjectedWeb3) {
      setStateWithRef([], setOtherAccounts, otherAccountsRef);
    }
  }, [network, checkingInjectedWeb3]);

  // Once extensions are fully initialised, fetch accounts from other sources.
  useEffectIgnoreInitial(() => {
    if (extensionAccountsSynced) {
      // Fetch accounts from supported hardware wallets.
      importLocalOtherAccounts(getLocalVaultAccounts);
      importLocalOtherAccounts(getLocalLedgerAccounts);

      // Mark hardware wallets as initialised.
      setOtherAccountsSynced(true);

      // Finally, fetch any read-only accounts that have been added by `system` or `user`.
      importLocalOtherAccounts(getLocalExternalAccounts);
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
        addOtherAccounts,
        addOrReplaceOtherAccount,
        renameOtherAccount,
        importLocalOtherAccounts,
        forgetOtherAccounts,
        accountsInitialised,
        otherAccounts,
      }}
    >
      {children}
    </OtherAccountsContext.Provider>
  );
};
