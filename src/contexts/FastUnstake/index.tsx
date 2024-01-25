// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  greaterThanZero,
  isNotZero,
  rmCommas,
  setStateWithRef,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import type { AnyApi, AnyJson, MaybeAddress } from 'types';
import Worker from 'workers/stakers?worker';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { validateLocalExposure } from 'contexts/Validators/Utils';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { defaultFastUnstakeContext, defaultMeta } from './defaults';
import type {
  FastUnstakeContextInterface,
  LocalMeta,
  MetaInterface,
} from './types';

const worker = new Worker();

export const FastUnstakeContext = createContext<FastUnstakeContextInterface>(
  defaultFastUnstakeContext
);

export const useFastUnstake = () => useContext(FastUnstakeContext);

export const FastUnstakeProvider = ({ children }: { children: ReactNode }) => {
  const { activeEra } = useApi();
  const { network } = useNetwork();
  const { activeAccount } = useActiveAccounts();
  const { inSetup, fetchEraStakers } = useStaking();
  const { getNominationStatus } = useNominationStatus();
  const {
    api,
    isReady,
    consts: { bondDuration },
    networkMetrics: { fastUnstakeErasToCheckPerBlock },
  } = useApi();
  const { nominees } = getNominationStatus(activeAccount, 'nominator');

  // store whether a fast unstake check is in progress.
  const [checking, setChecking] = useState<boolean>(false);
  const checkingRef = useRef(checking);

  // store whether the account is exposed for fast unstake
  const [isExposed, setIsExposed] = useState<boolean | null>(null);
  const isExposedRef = useRef(isExposed);

  // store state of elibigility checking.
  const [meta, setMeta] = useState<MetaInterface>(defaultMeta);
  const metaRef = useRef(meta);

  // store fastUnstake queue deposit for user.
  const [queueDeposit, setqueueDeposit] = useState<AnyApi>(null);
  const queueDepositRef = useRef(queueDeposit);

  // store fastUnstake head.
  const [head, setHead] = useState<AnyApi>(null);
  const headRef = useRef(head);

  // store fastUnstake counter for queue.
  const [counterForQueue, setCounterForQueue] = useState<number | null>(null);
  const counterForQueueRef = useRef(counterForQueue);

  // store fastUnstake subscription unsub.
  const unsubs = useRef<AnyApi[]>([]);

  // localStorage key to fetch local metadata.
  const getLocalkey = (a: MaybeAddress) => `${network}_fast_unstake_${a}`;

  // check until bond duration eras surpasssed.
  const checkToEra = activeEra.index.minus(bondDuration);

  // initiate fast unstake check for accounts that are nominating but not active.
  useEffectIgnoreInitial(() => {
    if (
      isReady &&
      activeAccount &&
      isNotZero(activeEra.index) &&
      fastUnstakeErasToCheckPerBlock > 0
    ) {
      // cancel fast unstake check on network change or account change.
      for (const unsub of unsubs.current) {
        unsub();
      }

      setStateWithRef(false, setChecking, checkingRef);
      setStateWithRef(null, setqueueDeposit, queueDepositRef);
      setStateWithRef(null, setCounterForQueue, counterForQueueRef);
      unsubs.current = [];

      // get any existing localStorage records for account.
      const localMeta: LocalMeta | null = getLocalMeta();

      const initialMeta = localMeta
        ? { checked: localMeta.checked }
        : defaultMeta;

      // even if localMeta.isExposed is false, we don't assume a final value until current era +
      // bondDuration is checked.
      let initialIsExposed = null;
      if (localMeta) {
        if (bondDuration.plus(1).isEqualTo(localMeta.checked.length)) {
          initialIsExposed = localMeta.isExposed;
        } else if (localMeta.isExposed === true) {
          initialIsExposed = true;
        } else {
          initialIsExposed = null;
        }
      }

      // checkpoint: initial local meta: localMeta

      setStateWithRef(initialMeta, setMeta, metaRef);
      setStateWithRef(initialIsExposed, setIsExposed, isExposedRef);

      // start process if account is inactively nominating & local fast unstake data is not
      // complete.
      if (
        activeAccount &&
        !inSetup() &&
        !nominees.active.length &&
        initialIsExposed === null
      ) {
        // if localMeta existed, start checking from the next era.
        const nextEra = localMeta?.checked.at(-1) || 0;
        const maybeNextEra = localMeta
          ? new BigNumber(nextEra - 1)
          : activeEra.index;

        // checkpoint: check from the possible next era `maybeNextEra`.

        processEligibility(activeAccount, maybeNextEra);
      }

      // subscribe to fast unstake queue immediately if synced in localStorage and still up to date.
      if (initialIsExposed === false) {
        subscribeToFastUnstakeQueue();
      }
    }

    return () => {
      for (const unsub of unsubs.current) {
        unsub();
      }
    };
  }, [
    inSetup(),
    isReady,
    network,
    activeAccount,
    activeEra.index,
    fastUnstakeErasToCheckPerBlock,
  ]);

  // handle worker message on completed exposure check.
  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      // ensure correct task received.
      const { data } = message;
      const { task } = data;
      if (task !== 'processEraForExposure') {
        return;
      }

      // ensure still same conditions.
      const { networkName, who } = data;
      if (networkName !== network || who !== activeAccount) {
        return;
      }

      const { era, exposed } = data;

      // ensure checked eras are in order highest first.
      const checked = metaRef.current.checked
        .concat(Number(era))
        .sort((a: number, b: number) => b - a);

      if (!metaRef.current.checked.includes(Number(era))) {
        // update localStorage with updated changes.
        localStorage.setItem(
          getLocalkey(who),
          JSON.stringify({
            isExposed: exposed,
            checked,
          })
        );

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
        // checkpoint: 'exposed! Stop checking.

        // cancel checking and update exposed state.
        setStateWithRef(false, setChecking, checkingRef);
        setStateWithRef(true, setIsExposed, isExposedRef);
      } else if (bondDuration.plus(1).isEqualTo(checked.length)) {
        // successfully checked current era - bondDuration eras.
        setStateWithRef(false, setChecking, checkingRef);
        setStateWithRef(false, setIsExposed, isExposedRef);

        // checkpoint: check finished, not exposed.

        // subscribe to fast unstake queue for user and queue counter.
        subscribeToFastUnstakeQueue();
      } else {
        // continue checking the next era.
        checkEra(new BigNumber(era).minus(1));
      }
    }
  };

  // initiate fast unstake eligibility check.
  const processEligibility = async (a: MaybeAddress, era: BigNumber) => {
    // ensure current era has synced
    if (
      era.isLessThan(0) ||
      !greaterThanZero(bondDuration) ||
      !api ||
      !a ||
      checkingRef.current ||
      !activeAccount
    ) {
      return;
    }

    setStateWithRef(true, setChecking, checkingRef);
    checkEra(era);
  };

  // calls service worker to check exppsures for given era.
  const checkEra = async (era: BigNumber) => {
    if (!api) {
      return;
    }

    const exposures = await fetchEraStakers(era.toString());

    worker.postMessage({
      task: 'processEraForExposure',
      era: era.toString(),
      who: activeAccount,
      networkName: network,
      exitOnExposed: true,
      exposures,
    });
  };

  // subscribe to fastUnstake queue
  const subscribeToFastUnstakeQueue = async () => {
    if (!api || !activeAccount) {
      return;
    }
    const subscribeQueue = async (a: MaybeAddress) => {
      const u = await api.query.fastUnstake.queue(a, (q: AnyApi) =>
        setStateWithRef(
          new BigNumber(rmCommas(q.unwrapOrDefault(0).toString())),
          setqueueDeposit,
          queueDepositRef
        )
      );
      return u;
    };
    const subscribeHead = async () => {
      const u = await api.query.fastUnstake.head((result: AnyApi) => {
        const h = result.unwrapOrDefault(null).toHuman();
        setStateWithRef(h, setHead, headRef);
      });
      return u;
    };
    const subscribeCounterForQueue = async () => {
      const u = await api.query.fastUnstake.counterForQueue(
        (result: AnyApi) => {
          const c = result.toHuman();
          setStateWithRef(c, setCounterForQueue, counterForQueueRef);
        }
      );
      return u;
    };

    // checkpoint: subscribing to queue + head.

    // initiate subscription, add to unsubs.
    await Promise.all([
      subscribeQueue(activeAccount),
      subscribeHead(),
      subscribeCounterForQueue(),
    ]).then((u) => {
      unsubs.current = u;
    });
  };

  // gets any existing fast unstake metadata for an account.
  const getLocalMeta = (): LocalMeta | null => {
    const localMeta: AnyJson = localStorage.getItem(getLocalkey(activeAccount));
    if (!localMeta) {
      return null;
    }

    const localMetaValidated = validateLocalExposure(
      JSON.parse(localMeta),
      checkToEra
    );
    if (!localMetaValidated) {
      // remove if not valid.
      localStorage.removeItem(getLocalkey(activeAccount));
      return null;
    }
    // set validated localStorage.
    localStorage.setItem(
      getLocalkey(activeAccount),
      JSON.stringify(localMetaValidated)
    );
    return localMetaValidated;
  };

  return (
    <FastUnstakeContext.Provider
      value={{
        getLocalkey,
        checking: checkingRef.current,
        meta: metaRef.current,
        isExposed: isExposedRef.current,
        queueDeposit: queueDepositRef.current,
        head: headRef.current,
        counterForQueue: counterForQueueRef.current,
      }}
    >
      {children}
    </FastUnstakeContext.Provider>
  );
};
