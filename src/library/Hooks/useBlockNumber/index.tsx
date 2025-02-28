// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useEffect, useRef, useState } from 'react';
import { useApi } from 'contexts/Api';
import type { AnyApi } from 'types';
import { useNetwork } from 'contexts/Network';

export const useBlockNumber = () => {
  const { network } = useNetwork();
  const { isReady, api } = useApi();

  // store the current block number.
  const [block, setBlock] = useState<BigNumber>(new BigNumber(0));

  // store block unsub.
  const unsub = useRef<AnyApi>();

  useEffect(() => {
    if (isReady) {
      subscribeBlockNumber();
    }
    return () => {
      if (unsub.current) {
        unsub.current();
      }
    };
  }, [network, isReady]);

  const subscribeBlockNumber = async () => {
    if (!api) {
      return;
    }

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
