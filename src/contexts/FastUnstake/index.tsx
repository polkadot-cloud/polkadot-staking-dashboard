// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useNetworkMetrics } from 'contexts/Network';
import React, { useRef, useState } from 'react';
import { MaybeAccount } from 'types';
// eslint-disable-next-line import/no-unresolved
import Worker from 'worker-loader!../../workers/stakers';
import { defaultMeta } from './defaults';
import { MetaInterface } from './types';

export const FastUnstakeContext = React.createContext<any>(null);

export const useFastUnstake = () => React.useContext(FastUnstakeContext);

const worker = new Worker();

export const FastUnstakeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, consts } = useApi();
  const { activeAccount } = useConnect();
  const { metrics } = useNetworkMetrics();
  const { activeEra } = metrics;
  const { bondDuration } = consts;

  // store whether a fast unstake check is in progress.
  // TODO: cancel checking on network change / account change.
  const [checking, setChecking] = useState<boolean>(false);

  // TODO: update meta on start + on each era finish
  const [meta, setMeta] = useState<MetaInterface>(defaultMeta);
  const metaRef = useRef(meta);

  // TODO: handle finished fast unstake eligibility check.
  // TODO: subscribe to fastUnstake.queue(activeAccount) if finally eligible and check has finished.
  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data } = message;
      const { task } = data;
      if (task !== 'fast_unstake_process_era') {
        // TODO: implement callback
      }
    }
  };

  // initiate fast unstake eligibility check.
  const fastUnstakeEligible = async (a: MaybeAccount) => {
    // ensure current era has synced
    if (
      activeEra.index === 0 ||
      !bondDuration ||
      !api ||
      !a ||
      checking ||
      !activeAccount
    )
      return;

    setChecking(true);

    // TODO: process one era at a time.
    // const calls = Array.from(Array(bondDuration).keys());
    // const exposuresRaw = await Promise.all(
    //   calls.map((c: number) =>
    //     api.query.staking.erasStakers.entries(metrics.activeEra.index - c)
    //   )
    // );

    // // humanise exposures to send to worker
    // const exposures = exposuresRaw.map((e: AnyApi) =>
    //   e.map(([_keys, _val]: AnyApi) => {
    //     return {
    //       keys: _keys.toHuman(),
    //       val: _val.toHuman(),
    //     };
    //   })
    // );

    // send to worker to calculate eligibiltiy
    // worker.postMessage({
    //   era,
    //   activeAccount,
    //   exposures,
    // });
  };

  return (
    <FastUnstakeContext.Provider value={{ fastUnstakeEligible }}>
      {children}
    </FastUnstakeContext.Provider>
  );
};
