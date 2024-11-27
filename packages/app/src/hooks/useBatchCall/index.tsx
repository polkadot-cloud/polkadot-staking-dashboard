// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { ApiController } from 'controllers/Api';
import { useProxySupported } from 'hooks/useProxySupported';
import type { UnsafeTx } from 'hooks/useSubmitExtrinsic/types';
import type { AnyApi, MaybeAddress } from 'types';

export const useBatchCall = () => {
  const { network } = useNetwork();
  const { activeProxy } = useActiveAccounts();
  const { isProxySupported } = useProxySupported();

  const newBatchCall = (txs: UnsafeTx[], from: MaybeAddress): AnyApi => {
    const api = ApiController.getApi(network);

    if (!api) {
      return undefined;
    }

    from = from || '';
    const batchTx = api.tx.Utility.batch({
      calls: txs.map((tx) => tx.decodedCall),
    });

    if (activeProxy && isProxySupported(batchTx, from)) {
      return api.tx.Utility.batch({
        calls: txs.map(
          (tx) =>
            api.tx.Proxy.proxy({
              real: {
                type: 'Id',
                value: from,
              },
              force_proxy_type: undefined,
              call: tx.decodedCall,
            }).decodedCall
        ),
      });
    }
    return batchTx;
  };

  return {
    newBatchCall,
  };
};
