// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  UnsupportedIfUniqueController,
  isSupportedProxyCall,
} from 'config/proxies';
import { useBonded } from 'contexts/Bonded';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useProxies } from 'contexts/Proxies';
import type { MaybeAddress } from 'types';
import type { AnyJson } from '@w3ux/types';
import type { UnsafeTx } from 'hooks/useSubmitExtrinsicPapi/types';

export const useProxySupportedPapi = () => {
  const { getBondedAccount } = useBonded();
  const { getProxyDelegate } = useProxies();
  const { activeProxy } = useActiveAccounts();

  // If call is from controller, & controller is different from stash, then proxy is not
  // supported.
  const controllerNotSupported = (c: string, f: MaybeAddress) =>
    UnsupportedIfUniqueController.includes(c) && getBondedAccount(f) !== f;

  // Determine whether the provided tx is proxy supported.
  const isProxySupported = (tx: UnsafeTx, delegator: MaybeAddress) => {
    // if already wrapped, return.
    if (
      tx?.decodedCall.type === 'Proxy' &&
      tx?.decodedCall.value.type === 'proxy'
    ) {
      return true;
    }

    const proxyDelegate = getProxyDelegate(delegator, activeProxy);
    const proxyType = proxyDelegate?.proxyType || '';
    const pallet: string = (tx?.decodedCall.type || '').toLowerCase();
    const method: string = (tx?.decodedCall.value.type || '').toLowerCase();
    const call = `${pallet}.${method}`;

    // If a batch call, test if every inner call is a supported proxy call.
    if (call === 'utility.batch') {
      return (tx?.decodedCall.value?.value?.calls || [])
        .map((c: AnyJson) => ({
          pallet: c.type,
          method: c.value.type,
        }))
        .every(
          (c: AnyJson) =>
            (isSupportedProxyCall(proxyType, c.pallet, c.method) ||
              (c.pallet === 'Proxy' && c.method === 'proxy')) &&
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
