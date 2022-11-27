// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Keyring from '@polkadot/keyring';
import { useApi } from 'contexts/Api';
import { useExtensions } from 'contexts/Extensions';
import { ExtensionInteface } from 'contexts/Extensions/types';
import { AnyFunction } from 'types';
import { isValidAddress } from 'Utils';
import { ExtensionAccount, ImportedAccount } from '../types';
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
    accounts: Array<ExtensionAccount>,
    extension: ExtensionInteface,
    injected: Array<ExtensionAccount>,
    callback: AnyFunction
  ) => {
    // update extensions status to connected.
    setExtensionStatus(id, 'connected');
    // update local active extensions
    addToLocalExtensions(id);

    // exit if no accounts to be imported.
    if (injected.length) {
      return handleInjectedAccounts(
        id,
        accounts,
        extension,
        injected,
        callback
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
    extension: ExtensionInteface,
    injected: Array<ExtensionAccount>,
    callback: AnyFunction
  ) => {
    // set network ss58 format
    const keyring = new Keyring();
    keyring.setSS58Format(network.ss58);

    // remove accounts that do not contain correctly formatted addresses.
    injected = injected.filter((i: ExtensionAccount) => {
      return isValidAddress(i.address);
    });

    // reformat addresses to ensure correct ss58 format
    injected.forEach(async (account: ExtensionAccount) => {
      const { address } = keyring.addFromAddress(account.address);
      account.address = address;
      return account;
    });

    // remove injected if they exist in local external accounts
    callback(getInExternalAccounts(injected, network));

    // remove accounts that have already been injected via another extension.
    injected = injected.filter(
      (i: ExtensionAccount) =>
        !accounts.map((j: ImportedAccount) => j.address).includes(i.address)
    );

    // format account properties.
    injected = injected.map((a: ExtensionAccount) => {
      return {
        address: a.address,
        source: id,
        name: a.name,
        signer: extension.signer,
      };
    });

    return injected;
  };

  // Get active extension account.
  //
  // checks if the local active account is in the extension.
  const getActiveExtensionAccount = (injected: Array<ImportedAccount>) => {
    return (
      injected.find(
        (a: ExtensionAccount) => a.address === getActiveAccountLocal(network)
      ) ?? null
    );
  };

  // Connect active extension account.
  //
  // Connects to active account if in extension.
  const connectActiveExtensionAccount = (
    activeWalletAccount: ImportedAccount | null,
    callback: AnyFunction
  ) => {
    if (activeWalletAccount !== null) {
      callback(activeWalletAccount);
    }
  };

  return {
    handleImportExtension,
    getActiveExtensionAccount,
    connectActiveExtensionAccount,
  };
};
