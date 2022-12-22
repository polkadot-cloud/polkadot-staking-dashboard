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
import { ExternalAccount, ImportedAccount } from '../types';
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
    forget: (a: Array<ExternalAccount>) => void
  ) => {
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
    return [];
  };

  // Handles importing of extension accounts.
  //
  // Gets accounts to be imported and commits them to state.
  const handleInjectedAccounts = (
    id: string,
    accounts: Array<ExtensionAccount>,
    extension: ExtensionInterface,
    newAccounts: Array<ExtensionAccount>,
    forget: (a: Array<ExternalAccount>) => void
  ) => {
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

    // remove newAccounts that exist in local external accounts
    forget(getInExternalAccounts(newAccounts, network));

    // remove accounts that have already been newAccounts via another extension
    newAccounts = newAccounts.filter(
      (i: ExtensionAccount) =>
        !accounts.map((j: ImportedAccount) => j.address).includes(i.address)
    );

    // format account properties
    newAccounts = newAccounts.map((a: ExtensionAccount) => {
      return {
        address: a.address,
        source: id,
        name: a.name,
        signer: extension.signer,
      };
    });
    return newAccounts;
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
