// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Keyring from '@polkadot/keyring';
import { useApi } from 'contexts/Api';
import { useExtensions } from 'contexts/Extensions';
import {
  ExtensionAccount,
  ExtensionInterface,
} from 'contexts/Extensions/types';
import { AnyFunction } from 'types';
import { isValidAddress } from 'Utils';
import { defaultHandleImportExtension } from '../defaults';
import { HandleImportExtension, ImportedAccount } from '../types';
import {
  addToLocalExtensions,
  getActiveAccountLocal,
  getInExternalAccounts,
} from '../Utils';

export const useImportExtension = () => {
  const { network } = useApi();
  const { setExtensionStatus } = useExtensions();

  // Handles importing of an extension.
  //
  // Adds extension metadata to state and updates local storage with
  // connected extensions. Calls separate method to handle account importing.
  const handleImportExtension = (
    id: string,
    currentAccounts: Array<ExtensionAccount>,
    extension: ExtensionInterface,
    newAccounts: Array<ExtensionAccount>,
    forget: (a: Array<ImportedAccount>) => void
  ): HandleImportExtension => {
    // update extensions status to connected.
    setExtensionStatus(id, 'connected');
    // update local active extensions
    addToLocalExtensions(id);

    if (newAccounts.length) {
      return handleInjectedAccounts(
        id,
        currentAccounts,
        extension,
        newAccounts,
        forget
      );
    }
    return defaultHandleImportExtension;
  };

  // Handles importing of extension accounts.
  //
  // Gets accounts to be imported and commits them to state.
  const handleInjectedAccounts = (
    id: string,
    currentAccounts: Array<ExtensionAccount>,
    extension: ExtensionInterface,
    newAccounts: Array<ExtensionAccount>,
    forget: (a: Array<ImportedAccount>) => void
  ): HandleImportExtension => {
    // set network ss58 format
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);

    // remove accounts that do not contain correctly formatted addresses.
    newAccounts = newAccounts.filter((i: ExtensionAccount) => {
      return isValidAddress(i.address);
    });

    // reformat addresses to ensure correct ss58 format
    newAccounts.forEach(async (account: ExtensionAccount) => {
      const { address } = keyring.addFromAddress(account.address);
      account.address = address;
      return account;
    });

    // remove newAccounts from local external accounts if present
    const inExternal = getInExternalAccounts(newAccounts, network);
    forget(inExternal);

    // find any accounts that have been removed from this extension
    const goneFromExtension = currentAccounts
      .filter((j: ImportedAccount) => j.source === id)
      .filter(
        (j: ImportedAccount) =>
          !newAccounts.find((i: ExtensionAccount) => i.address === j.address)
      );
    // check whether active account is present in forgotten accounts
    const activeGoneFromExtension = goneFromExtension.find(
      (i: ImportedAccount) => i.address === getActiveAccountLocal(network)
    );
    // commit remove forgotten accounts
    forget(goneFromExtension);

    // remove accounts that have already been added to currentAccounts via another extension.
    // note: does not include external accounts.
    newAccounts = newAccounts.filter(
      (i: ExtensionAccount) =>
        !currentAccounts.find(
          (j: ImportedAccount) =>
            j.address === i.address && j.source !== 'external'
        )
    );

    // format accounts properties
    newAccounts = newAccounts.map((a: ExtensionAccount) => {
      return {
        address: a.address,
        source: id,
        name: a.name,
        signer: extension.signer,
      };
    });
    return {
      newAccounts,
      meta: {
        removedActiveAccount: activeGoneFromExtension?.address ?? null,
      },
    };
  };

  // Get active extension account.
  //
  // checks if the local active account is in the extension.
  const getActiveExtensionAccount = (accounts: Array<ImportedAccount>) =>
    accounts.find(
      (a: ExtensionAccount) => a.address === getActiveAccountLocal(network)
    ) ?? null;

  // Connect active extension account.
  //
  // Connects to active account if it is provided.
  const connectActiveExtensionAccount = (
    account: ImportedAccount | null,
    callback: AnyFunction
  ) => {
    if (account !== null) {
      callback(account);
    }
  };

  return {
    handleImportExtension,
    getActiveExtensionAccount,
    connectActiveExtensionAccount,
  };
};
