// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { AnyApi, AnyJson } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import {
  NetworksWithPagedRewards,
  PagedRewardsStartEra,
} from 'config/networks';
import { useApi } from '../Api';
import * as defaults from './defaults';
import type {
  ActiveEra,
  NetworkMetrics,
  NetworkMetricsContextInterface,
} from './types';

export const NetworkMetricsContext =
  createContext<NetworkMetricsContextInterface>(defaults.defaultNetworkContext);

export const useNetworkMetrics = () => useContext(NetworkMetricsContext);

export const NetworkMetricsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { network } = useNetwork();
  const { isReady, api } = useApi();

  // Store active era in state.
  const [activeEra, setActiveEra] = useState<ActiveEra>(defaults.activeEra);
  const activeEraRef = useRef(activeEra);

  // Store network metrics in state.
  const [metrics, setMetrics] = useState<NetworkMetrics>(defaults.metrics);
  const metricsRef = useRef(metrics);

  // Store unsubscribe objects.
  const unsubsRef = useRef<AnyApi[]>([]);

  // active subscription
  const initialiseSubscriptions = async () => {
    if (!api) {
      return;
    }

    if (isReady) {
      const subscribeToMetrics = async () => {
        const unsub = await api.queryMulti(
          [
            api.query.balances.totalIssuance,
            api.query.auctions.auctionCounter,
            api.query.paraSessionInfo.earliestStoredSession,
            api.query.fastUnstake.erasToCheckPerBlock,
            api.query.staking.minimumActiveStake,
          ],
          ([
            totalIssuance,
            auctionCounter,
            earliestStoredSession,
            erasToCheckPerBlock,
            minimumActiveStake,
          ]: AnyApi) => {
            setStateWithRef(
              {
                totalIssuance: new BigNumber(totalIssuance.toString()),
                auctionCounter: new BigNumber(auctionCounter.toString()),
                earliestStoredSession: new BigNumber(
                  earliestStoredSession.toString()
                ),
                fastUnstakeErasToCheckPerBlock: erasToCheckPerBlock.toNumber(),
                minimumActiveStake: new BigNumber(
                  minimumActiveStake.toString()
                ),
              },
              setMetrics,
              metricsRef
            );
          }
        );
        return unsub;
      };

      const subscribeToActiveEra = async () => {
        const unsub = await api.query.staking.activeEra((result: AnyApi) => {
          // determine activeEra: toString used as alternative to `toHuman`, that puts commas in
          // numbers
          let newActiveEra = result
            .unwrapOrDefault({
              index: 0,
              start: 0,
            })
            .toString();

          newActiveEra = JSON.parse(newActiveEra);
          setStateWithRef(
            {
              index: new BigNumber(newActiveEra.index),
              start: new BigNumber(newActiveEra.start),
            },
            setActiveEra,
            activeEraRef
          );
        });
        return unsub;
      };

      // initiate subscription, add to unsubs.
      await Promise.all([subscribeToMetrics(), subscribeToActiveEra()]).then(
        (u) => {
          unsubsRef.current = unsubsRef.current.concat(u);
        }
      );
    }
  };

  // Given an era, determine whether paged rewards are active.
  const isPagedRewardsActive = (era: BigNumber): boolean => {
    const networkStartEra = PagedRewardsStartEra[network];
    if (!networkStartEra) {
      return false;
    }

    return (
      NetworksWithPagedRewards.includes(network) &&
      era.isGreaterThanOrEqualTo(networkStartEra)
    );
  };

  // Unsubscribe from unsubs.
  const unsubscribe = () => {
    Object.values(unsubsRef.current).forEach((unsub: AnyJson) => {
      unsub();
    });
  };

  // Set defaults for all metrics.
  const handleResetMetrics = () => {
    unsubscribe();
    unsubsRef.current = [];
    setStateWithRef(defaults.activeEra, setActiveEra, activeEraRef);
    setStateWithRef(defaults.metrics, setMetrics, metricsRef);
  };

  // manage unsubscribe
  useEffectIgnoreInitial(() => {
    initialiseSubscriptions();
    return () => {
      unsubscribe();
    };
  }, [isReady]);

  // Reset active era and metrics on network change.
  useEffectIgnoreInitial(() => {
    handleResetMetrics();
  }, [network]);

  return (
    <NetworkMetricsContext.Provider
      value={{
        activeEra: activeEraRef.current,
        metrics: metricsRef.current,
        isPagedRewardsActive,
      }}
    >
      {children}
    </NetworkMetricsContext.Provider>
  );
};
