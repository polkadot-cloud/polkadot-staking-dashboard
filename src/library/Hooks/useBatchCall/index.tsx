// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import type { AnyApi } from 'types';

export const useBatchCall = () => {
  const { api } = useApi();
  // TODO: wrap calls in proxy.proxy if there is an active proxy and proxy is supported.

  // const { activeProxy } = useConnect();
  // const { isProxySupported } = useProxySupported();

  const newBatchCall = (txs: AnyApi[]) => {
    if (!api) return null;

    return api?.tx.utility.batch(txs);
  };

  return {
    newBatchCall,
  };
};
