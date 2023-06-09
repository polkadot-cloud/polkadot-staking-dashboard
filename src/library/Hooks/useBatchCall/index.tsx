// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import type { AnyApi, MaybeAccount } from 'types';
import { useProxySupported } from '../useProxySupported';

export const useBatchCall = () => {
  const { api } = useApi();
  const { activeProxy } = useConnect();
  const { isProxySupported } = useProxySupported();

  const newBatchCall = (txs: AnyApi[], from: MaybeAccount) => {
    if (!api) return null;

    from = from || '';

    if (activeProxy && isProxySupported(api.tx.utility.batch(txs), from)) {
      return api?.tx.utility.batch(
        txs.map((tx) =>
          api.tx.proxy.proxy(
            {
              id: from,
            },
            null,
            tx
          )
        )
      );
    }
    return api?.tx.utility.batch(txs);
  };

  return {
    newBatchCall,
  };
};
