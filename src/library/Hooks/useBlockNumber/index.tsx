// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useEffect, useState } from 'react';
import { AnyApi } from 'types';
import { rmCommas } from 'Utils';

export const useBlockNumber = () => {
  const { isReady, api, network } = useApi();

  // store the current block number.
  const [block, setBlock] = useState<BigNumber>(new BigNumber(0));

  // store network metrics unsubscribe.
  const [unsub, setUnsub] = useState<AnyApi>(undefined);

  useEffect(() => {
    if (!isReady) return;

    subscribeBlockNumber();

    return () => {
      if (unsub) unsub();
    };
  }, [network, isReady]);

  const subscribeBlockNumber = async () => {
    if (!api) return;

    const subscribeBlock = async () => {
      const u = await api.query.system.number((number: AnyApi) => {
        setBlock(new BigNumber(rmCommas(number.toString())));
      });
      return u;
    };
    Promise.all([subscribeBlock]).then((u) => {
      setUnsub(u[0]);
    });
  };

  return block;
};
