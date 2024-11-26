// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useProxySupported } from 'hooks/useProxySupported';
import type { AnyApi, MaybeAddress } from 'types';

export const useBatchCall = () => {
  const { api } = useApi();
  const { activeProxy } = useActiveAccounts();
  const { isProxySupported } = useProxySupported();

  const newBatchCall = (txs: AnyApi[], from: MaybeAddress): AnyApi => {
    if (!api) {
      return undefined;
    }

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
