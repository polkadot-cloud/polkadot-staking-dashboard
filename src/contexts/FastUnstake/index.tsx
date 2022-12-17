// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi, MaybeAccount } from 'types';
// eslint-disable-next-line import/no-unresolved
import { setStateWithRef } from 'Utils';
import Worker from 'worker-loader!../../workers/stakers';
import { defaultFastUnstakeContext, defaultMeta } from './defaults';
import { FastUnstakeContextInterface, MetaInterface } from './types';

export const FastUnstakeContext =
  React.createContext<FastUnstakeContextInterface>(defaultFastUnstakeContext);

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
  const { inSetup, getNominationsStatus } = useStaking();
  const { activeEra, fastUnstakeErasToCheckPerBlock } = metrics;
  const { bondDuration } = consts;
  const nominationStatuses = getNominationsStatus();

  // store whether a fast unstake check is in progress.
  const [checking, setChecking] = useState<boolean>(false);
  const checkingRef = useRef(checking);

  // store whether the account is exposed for fast unstake
  const [isExposed, setIsExposed] = useState<boolean | null>(null);
  const isExposedRef = useRef(isExposed);

  // store state of elibigility checking.
  const [meta, setMeta] = useState<MetaInterface>(defaultMeta);
  const metaRef = useRef(meta);

  // store fastUnstake queue status for user.
  const [queueStatus, setQueueStatus] = useState<AnyApi>(null);
  const queueStatusRef = useRef(queueStatus);

  // store fastUnstake counter for queue.
  const [counterForQueue, setCounterForQueue] = useState<number | null>(null);
  const counterForQueueRef = useRef(counterForQueue);

  // store fastUnstake subscription unsub.
  const [unsub, setUnsub] = useState<AnyApi>(null);
  const unsubRef = useRef(unsub);

  // TEST: subscribe to fastUnstake immediately.
  // TODO: remove on impl finish.
  useEffect(() => {
    subscribeFastUnstakeQueue();
  }, []);

  // initiate fast unstake check for accounts that are
  // nominating but not active.
  useEffect(() => {
    if (
      isReady &&
      activeAccount &&
      activeEra.index !== 0 &&
      fastUnstakeErasToCheckPerBlock > 0
    ) {
      // cancel fast unstake check on network change or
      // account change.
      if (typeof unsubRef.current === 'function') {
        unsubRef.current();
      }
      setStateWithRef(defaultMeta, setMeta, metaRef);
      setStateWithRef(null, setIsExposed, isExposedRef);
      setStateWithRef(null, setQueueStatus, queueStatusRef);
      setStateWithRef(null, setCounterForQueue, counterForQueueRef);
      setStateWithRef(false, setChecking, checkingRef);

      // check for any active nominations
      const activeNominations = Object.entries(nominationStatuses)
        .map(([k, v]: any) => (v === 'active' ? k : false))
        .filter((v) => v !== false);

      // start process if account is inactively nominating
      if (activeAccount && !inSetup() && !activeNominations.length) {
        processEligibility(activeAccount);
      }
    }

    return () => {
      if (typeof unsubRef.current === 'function') {
        unsubRef.current();
      }
    };
  }, [
    isReady,
    activeAccount,
    network.name,
    activeEra.index,
    inSetup(),
    fastUnstakeErasToCheckPerBlock,
  ]);

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
      if (exposed) {
        console.log('exposed! Stop checking.');

        // if exposed, cancel checking and update exposed state.
        setStateWithRef(false, setChecking, checkingRef);
        setStateWithRef(true, setIsExposed, isExposedRef);
      } else if (meta.checked.length === bondDuration) {
        // successfully checked bondDuration eras.
        setStateWithRef(false, setChecking, checkingRef);
        setStateWithRef(false, setIsExposed, isExposedRef);
        console.log('check finished! not exposed!');
        // subscribe to fast unstake queue for user and queue counter.
        subscribeFastUnstakeQueue();
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
      checkingRef.current ||
      !activeAccount
    )
      return;
    setStateWithRef(true, setChecking, checkingRef);
    setMetaCurrentEra(activeEra.index);
    checkEra(activeEra.index);
  };

  // subscribe to fastUnstake queue
  const subscribeFastUnstakeQueue = async () => {
    if (!api || !activeAccount) return;

    const u = await api.queryMulti<AnyApi>(
      [
        [api.query.fastUnstake.queue, activeAccount],
        api.query.fastUnstake.counterForQueue,
      ],
      ([_queue, _counterForQueue]) => {
        setStateWithRef(_queue.toHuman(), setQueueStatus, queueStatusRef);
        setStateWithRef(
          _counterForQueue.toHuman(),
          setCounterForQueue,
          counterForQueueRef
        );
      }
    );

    setStateWithRef(u, setUnsub, unsubRef);
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
    <FastUnstakeContext.Provider
      value={{
        checking: checkingRef.current,
        meta: metaRef.current,
        isExposed: isExposedRef.current,
        queueStatus: queueStatusRef.current,
        counterForQueue: counterForQueueRef.current,
      }}
    >
      {children}
    </FastUnstakeContext.Provider>
  );
};
