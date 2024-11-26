// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import {
  UnsupportedIfUniqueController,
  isSupportedProxyCall,
} from 'config/proxies';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useBonded } from 'contexts/Bonded';
import { useProxies } from 'contexts/Proxies';
import type { AnyApi, MaybeAddress } from 'types';

export const useProxySupported = () => {
  const { getBondedAccount } = useBonded();
  const { getProxyDelegate } = useProxies();
  const { activeProxy } = useActiveAccounts();

  // If call is from controller, & controller is different from stash, then proxy is not
  // supported.
  const controllerNotSupported = (c: string, f: MaybeAddress) =>
    UnsupportedIfUniqueController.includes(c) && getBondedAccount(f) !== f;

  // Determine whether the provided tx is proxy supported.
  const isProxySupported = (tx: AnyApi, delegator: MaybeAddress) => {
    // if already wrapped, return.
    if (
      tx?.method.toHuman().section === 'proxy' &&
      tx?.method.toHuman().method === 'proxy'
    ) {
      return true;
    }

    const proxyDelegate = getProxyDelegate(delegator, activeProxy);
    const proxyType = proxyDelegate?.proxyType || '';
    const pallet = tx?.method.toHuman().section;
    const method = tx?.method.toHuman().method;
    const call = `${pallet}.${method}`;

    // If a batch call, test if every inner call is a supported proxy call.
    if (call === 'utility.batch') {
      return (tx?.method?.toHuman()?.args?.calls || [])
        .map((c: AnyJson) => ({
          pallet: c.section,
          method: c.method,
        }))
        .every(
          (c: AnyJson) =>
            (isSupportedProxyCall(proxyType, c.pallet, c.method) ||
              (c.pallet === 'proxy' && c.method === 'proxy')) &&
            !controllerNotSupported(`${pallet}.${method}`, delegator)
        );
    }

    // Check if the current call is a supported proxy call.
    return (
      isSupportedProxyCall(proxyType, pallet, method) &&
      !controllerNotSupported(call, delegator)
    );
  };

  return {
    isProxySupported,
  };
};
