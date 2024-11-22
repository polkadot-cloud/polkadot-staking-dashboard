// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi, MaybeAddress } from 'types';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ApiController } from 'controllers/Api';
import { useNetwork } from 'contexts/Network';
import { useProxySupported } from 'hooks/useProxySupported';
import type { UnsafeTx } from 'hooks/useSubmitExtrinsic/types';

export const useBatchCall = () => {
  const { network } = useNetwork();
  const { activeProxy } = useActiveAccounts();
  const { isProxySupported } = useProxySupported();

  const newBatchCall = (txs: UnsafeTx[], from: MaybeAddress): AnyApi => {
    const { pApi } = ApiController.get(network);

    if (!pApi) {
      return undefined;
    }

    from = from || '';
    const batchTx = pApi.tx.Utility.batch({
      calls: txs.map((tx) => tx.decodedCall),
    });

    if (activeProxy && isProxySupported(batchTx, from)) {
      return pApi.tx.Utility.batch({
        calls: txs.map(
          (tx) =>
            pApi.tx.Proxy.proxy({
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
