// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useExtensions } from 'contexts/Extensions';
import { ExtensionInteface } from 'contexts/Extensions/types';
import { isValidAddress } from 'Utils';
import { ExtensionAccount, ImportedAccount } from '../types';
import { addToLocalExtensions } from '../Utils';

export const useImportExtension = (accounts: Array<ImportedAccount>) => {
  const { setExtensionStatus } = useExtensions();

  // handles connecting to a new extension.
  //
  // Adds extension metadata to state and updates local storage with
  // connected extensions. Calls separate method to handle account importing.
  const handleImportExtension = (
    id: string,
    extension: ExtensionInteface,
    injected: Array<ExtensionAccount>
  ) => {
    // update extensions status to connected.
    setExtensionStatus(id, 'connected');
    // update local active extensions
    addToLocalExtensions(id);

    // exit if no accounts to be imported.
    if (injected.length) {
      return handleInjectedAccounts(id, extension, injected);
    }
    return [];
  };

  // handles importing of extension accounts.
  //
  // Gets accounts to be imported and commits them to state.
  const handleInjectedAccounts = (
    id: string,
    extension: ExtensionInteface,
    injected: Array<ExtensionAccount>
  ) => {
    // forget external accounts that are being injected now.

    // remove accounts that have already been injected via another extension.
    injected = injected.filter(
      (i: ExtensionAccount) =>
        !accounts.map((j: ImportedAccount) => j.address).includes(i.address)
    );
    // remove accounts that do not contain correctly formatted addresses.
    injected = injected.filter((i: ExtensionAccount) => {
      return isValidAddress(i.address);
    });
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

  return {
    handleImportExtension,
  };
};
