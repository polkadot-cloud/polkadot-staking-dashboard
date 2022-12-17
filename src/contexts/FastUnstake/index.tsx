// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useNetworkMetrics } from 'contexts/Network';
import React, { useEffect, useRef, useState } from 'react';
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
  const { api, isReady, consts, network } = useApi();
  const { activeAccount } = useConnect();
  const { metrics } = useNetworkMetrics();
  const { activeEra } = metrics;
  const { bondDuration } = consts;

  // store whether a fast unstake check is in progress.
  const [checking, setChecking] = useState<boolean>(false);

  // store whether the account is exposed for fast unstake
  const [isExposed, setIsExposed] = useState<boolean | null>(null);
  const isExposedRef = useRef(isExposed);

  // store state of elibigility checking.
  const [meta, setMeta] = useState<MetaInterface>(defaultMeta);
  const metaRef = useRef(meta);

  // initiate fast unstake check for accounts that are
  // nominating but not active.
  useEffect(() => {
    if (isReady && activeAccount && activeEra.index !== 0) {
      // cancel fast unstake check on network change or
      // account change.
      setStateWithRef(defaultMeta, setMeta, metaRef);
      setChecking(false);

      // TODO: only trigger when nominator and inactive.
      if (activeAccount) {
        processEligibility(activeAccount);
      }
    }
  }, [isReady, activeAccount, network.name, activeEra.index]);

  // handle worker message on completed exposure check.
  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      // ensure correct task received
      const { data } = message;
      const { task } = data;
      if (task !== 'process_fast_unstake_era') {
        return;
      }
      // ensure still same conditions.
      const { where, who } = data;
      if (where !== network.name || who !== activeAccount) {
        console.log('conditions have changed, cancel fast unstake.');
        return;
      }
      const { currentEra, exposed } = data;

      // update check metadata, decrement current era.
      const nextEra = currentEra - 1;
      const { checked } = metaRef.current;
      if (!metaRef.current.checked.includes(currentEra)) {
        setStateWithRef(
          Object.assign(metaRef.current, {
            currentEra: nextEra,
            checked: checked.concat(currentEra),
          }),
          setMeta,
          metaRef
        );
      }
      // if exposed, cancel checking and update exposed state.
      if (exposed) {
        setChecking(false);
        setStateWithRef(true, setIsExposed, isExposedRef);
      } else if (meta.checked.length === bondDuration) {
        // successfully checked bondDuration eras.
        console.log('check finished! not exposed!');
        // TODO: subscribe to fastUnstake.queue(activeAccount) if finally eligible and check has finished.
      } else {
        // continue checking the next era.
        checkEra(nextEra);
      }
    }
  };

  // set currentEra being checked in metadata
  const setMetaCurrentEra = (era: number) => {
    const m = Object.assign(meta, {
      currentEra: era,
    });
    setStateWithRef(m, setMeta, metaRef);
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

  // calls service worker to check exppsures for given era.
  const checkEra = async (era: number) => {
    if (!api) return;

    console.log('checking era ', era);

    const exposuresRaw = await api.query.staking.erasStakers.entries(era);
    const exposures = exposuresRaw.map(([keys, val]: AnyApi) => {
      return {
        keys: keys.toHuman(),
        val: val.toHuman(),
      };
    });
    worker.postMessage({
      task: 'process_fast_unstake_era',
      currentEra: era,
      who: activeAccount,
      where: network.name,
      exposures,
    });
  };

  return (
    <FastUnstakeContext.Provider value={{ processEligibility }}>
      {children}
    </FastUnstakeContext.Provider>
  );
};
