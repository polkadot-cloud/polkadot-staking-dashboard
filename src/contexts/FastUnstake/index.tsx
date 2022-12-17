// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useNetworkMetrics } from 'contexts/Network';
import React, { useRef, useState } from 'react';
import { AnyApi, MaybeAccount } from 'types';
// eslint-disable-next-line import/no-unresolved
import { setStateWithRef } from 'Utils';
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

  // store state of elibigility checking.
  const [meta, setMeta] = useState<MetaInterface>(defaultMeta);
  const metaRef = useRef(meta);

  // set currentEra being checked in metadata
  //
  // called when a new era is about to be processed.
  const setMetaCurrentEra = (era: number) => {
    const m = Object.assign(meta, {
      currentEra: era,
    });
    setStateWithRef(m, setMeta, metaRef);
  };

  worker.onmessage = (message: MessageEvent) => {
    // TODO: if network or account switch has happened, return.
    if (message) {
      const { data } = message;
      const { task } = data;
      if (task !== 'fast_unstake_process_era') {
        // TODO: update meta.checked on each era finish.
        // TODO: subscribe to fastUnstake.queue(activeAccount) if finally eligible and check has finished.
        // TODO: cancel fast unstake check if indeed exposed - not eligible.
      }
    }
  };

  // initiate fast unstake eligibility check.
  const processEligibility = async (a: MaybeAccount) => {
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
    setMetaCurrentEra(activeEra.index);
    checkEra(activeEra.index);
  };

  // checks an era for exposure.
  //
  // calls service worker to check exppsures for given era.
  const checkEra = async (era: number) => {
    if (!api) return;

    // fetch and humaise exposures.
    const exposuresRaw = await api.query.staking.erasStakers.entries(era);
    const exposures = exposuresRaw.map(([keys, val]: AnyApi) => {
      return {
        keys: keys.toHuman(),
        val: val.toHuman(),
      };
    });

    // TODO: send to worker to calculate eligibiltiy
    // worker.postMessage({
    //   era,
    //   activeAccount,
    //   network,
    //   exposures,
    // });
  };

  return (
    <FastUnstakeContext.Provider value={{ processEligibility }}>
      {children}
    </FastUnstakeContext.Provider>
  );
};
