// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Keyring from '@polkadot/keyring';
import { localStorageOrDefault } from '@w3ux/utils';
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
