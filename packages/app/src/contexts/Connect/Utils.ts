// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatAccountSs58, localStorageOrDefault } from '@w3ux/utils';
import type { NetworkId } from 'common-types';
import type { ActiveProxy } from 'contexts/ActiveAccounts/types';

// Gets local `activeAccount` for a network.
export const getActiveAccountLocal = (network: NetworkId, ss58: number) => {
  const address = localStorageOrDefault(`${network}_active_account`, null);
  if (address) {
    const formattedAddress = formatAccountSs58(address, ss58);

    if (formattedAddress) {
      return formattedAddress;
    }
  }
  return null;
};

// Gets local `activeProxy` for a network.
export const getActiveProxyLocal = (
  network: NetworkId,
  ss58: number
): ActiveProxy | null => {
  const localActiveProxy = localStorageOrDefault(
    `${network}_active_proxy`,
    null
  ) as ActiveProxy | null;

  if (localActiveProxy && localActiveProxy?.address) {
    const formattedAddress = formatAccountSs58(localActiveProxy.address, ss58);
    if (formattedAddress) {
      localActiveProxy.address = formattedAddress;
      return localActiveProxy;
    }
  }
  return null;
};
