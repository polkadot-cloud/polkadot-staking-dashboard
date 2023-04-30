// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { rmCommas } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useEffect, useRef, useState } from 'react';
import type { AnyApi } from 'types';

export const useBlockNumber = () => {
  const { isReady, api, network } = useApi();

  // store the current block number.
  const [block, setBlock] = useState<BigNumber>(new BigNumber(0));

  // store block unsub.
  const unsub = useRef<AnyApi>();

  useEffect(() => {
    if (!isReady) return;

    subscribeBlockNumber();

    return () => {
      if (unsub.current) unsub.current();
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
    Promise.all([subscribeBlock]).then(([u]) => {
      unsub.current = u;
    });
  };

  return block;
};
