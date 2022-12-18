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

  // store fastUnstake head.
  const [head, setHead] = useState<AnyApi>(null);
  const headRef = useRef(head);

  // store fastUnstake counter for queue.
  const [counterForQueue, setCounterForQueue] = useState<number | null>(null);
  const counterForQueueRef = useRef(counterForQueue);

  // store fastUnstake subscription unsub.
  const [unsub, setUnsub] = useState<Array<AnyApi>>([]);
  const unsubRef = useRef(unsub);

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
      if (unsubRef.current.length) {
        for (const u of unsubRef.current) {
          u();
        }
      }

      setStateWithRef(false, setChecking, checkingRef);
      setStateWithRef(null, setQueueStatus, queueStatusRef);
      setStateWithRef(null, setCounterForQueue, counterForQueueRef);
      setStateWithRef([], setUnsub, unsubRef);

      // TODO: get any localStorage and check if it is still valid.
      // TODO: remove expired eras (below activeEra - bondDuration).
      // TODO: check if highest -> lowest are decremented, no missing eras.
      // TODO: update localStorage with updated changes.
      /*
      {
        isExposed: boolean;
        checked: Array<number>;
      }
      */

      // TODO: prefill if localStorage data is still up to date.
      setStateWithRef(defaultMeta, setMeta, metaRef);
      setStateWithRef(null, setIsExposed, isExposedRef);

      // check for any active nominations
      const activeNominations = Object.entries(nominationStatuses)
        .map(([k, v]: any) => (v === 'active' ? k : false))
        .filter((v) => v !== false);

      // start process if account is inactively nominating
      // TODO: check if any processing is needed with localStorage records.
      if (activeAccount && !inSetup() && !activeNominations.length) {
        processEligibility(activeAccount);
      }

      // TODO: subscribe to fast unstake queue immediately if synced in localStorage and still up to date.
      // subscribeToFastUnstakeQueue();.
    }

    return () => {
      if (unsubRef.current.length) {
        for (const u of unsubRef.current) {
          u();
        }
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
        // eslint-disable-next-line no-console
        console.log('conditions have changed, cancel fast unstake.');
        return;
      }
      const { currentEra, exposed } = data;

      // update check metadata, decrement current era.
      const nextEra = currentEra - 1;

      // TODO: order `checked` with highest era first.
      const checked = metaRef.current.checked.concat(currentEra);
      if (!metaRef.current.checked.includes(currentEra)) {
        // TODO: update localStorage with updated changes.
        // localStorage.setItem(...);

        // update check metadata.
        setStateWithRef(
          {
            checked,
          },
          setMeta,
          metaRef
        );
      }

      if (exposed) {
        // eslint-disable-next-line no-console
        console.log('exposed! Stop checking.');

        // if exposed, cancel checking and update exposed state.
        setStateWithRef(false, setChecking, checkingRef);
        setStateWithRef(true, setIsExposed, isExposedRef);
      } else if (checked.length === bondDuration) {
        // successfully checked bondDuration eras.
        setStateWithRef(false, setChecking, checkingRef);
        setStateWithRef(false, setIsExposed, isExposedRef);

        // eslint-disable-next-line no-console
        console.log('check finished! not exposed!');

        // subscribe to fast unstake queue for user and queue counter.
        subscribeToFastUnstakeQueue();
      } else {
        // continue checking the next era.
        checkEra(nextEra);
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
      checkingRef.current ||
      !activeAccount
    )
      return;

    setStateWithRef(true, setChecking, checkingRef);
    setStateWithRef(
      {
        checked: [],
      },
      setMeta,
      metaRef
    );
    checkEra(activeEra.index);
  };

  // subscribe to fastUnstake queue
  const subscribeToFastUnstakeQueue = async () => {
    if (!api || !activeAccount) return;
    const subscribeQueue = async (a: MaybeAccount) => {
      const u = await api.query.fastUnstake.queue(a, (_queue: AnyApi) => {
        const q = _queue.unwrapOrDefault(null).toHuman();
        setStateWithRef(q, setQueueStatus, queueStatusRef);
      });
      return u;
    };
    const subscribeHead = async () => {
      const u = await api.query.fastUnstake.head((_head: AnyApi) => {
        const h = _head.unwrapOrDefault(null).toHuman();
        setStateWithRef(h, setHead, headRef);
      });
      return u;
    };
    const subscribeCounterForQueue = async () => {
      const u = await api.query.fastUnstake.counterForQueue(
        (_counterForQueue: AnyApi) => {
          const c = _counterForQueue.toHuman();
          setStateWithRef(c, setCounterForQueue, counterForQueueRef);
        }
      );
      return u;
    };

    // eslint-disable-next-line no-console
    console.log('subscribing to queue + head');

    // initiate subscription, add to unsubs.
    await Promise.all([
      subscribeQueue(activeAccount),
      subscribeHead(),
      subscribeCounterForQueue(),
    ]).then((u: any) => {
      setStateWithRef(u, setUnsub, unsubRef);
    });
  };

  // calls service worker to check exppsures for given era.
  const checkEra = async (era: number) => {
    if (!api) return;
    // eslint-disable-next-line no-console
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
        head: headRef.current,
        counterForQueue: counterForQueueRef.current,
      }}
    >
      {children}
    </FastUnstakeContext.Provider>
  );
};
