// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Keyring from '@polkadot/keyring';
import { localStorageOrDefault } from '@w3ux/utils';
import type { ActiveProxy } from 'contexts/ActiveAccounts/types';
import type { NetworkName } from 'types';

// Gets local `activeAccount` for a network.
export const getActiveAccountLocal = (network: NetworkName, ss58: number) => {
  const keyring = new Keyring();
  keyring.setSS58Format(ss58);
  let account = localStorageOrDefault(`${network}_active_account`, null);
  if (account !== null) {
    account = keyring.addFromAddress(account).address;
  }
  return account;
};

// Gets local `activeProxy` for a network.
export const getActiveProxyLocal = (network: NetworkName, ss58: number) => {
  const keyring = new Keyring();
  keyring.setSS58Format(ss58);
  const localActiveProxy = localStorageOrDefault(
    `${network}_active_proxy`,
    null
  ) as ActiveProxy | null;

  if (localActiveProxy !== null && localActiveProxy?.address) {
    localActiveProxy.address = keyring.addFromAddress(
      localActiveProxy.address
    ).address;
  }

  return localActiveProxy;
};
