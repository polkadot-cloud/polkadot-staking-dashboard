// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi, AnyJson } from 'types';
import { setStateWithRef } from 'Utils';
import { useApi } from '../Api';
import * as defaults from './defaults';
import {
  ActiveEra,
  NetworkMetrics,
  NetworkMetricsContextInterface,
} from './types';

export const NetworkMetricsContext =
  React.createContext<NetworkMetricsContextInterface>(
    defaults.defaultNetworkContext
  );

export const useNetworkMetrics = () => React.useContext(NetworkMetricsContext);

export const NetworkMetricsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady, api, network } = useApi();

  // Store active era in state.
  const [activeEra, setActiveEra] = useState<ActiveEra>(defaults.activeEra);
  const activeEraRef = useRef(activeEra);

  // Store network metrics in state.
  const [metrics, setMetrics] = useState<NetworkMetrics>(defaults.metrics);
  const metricsRef = useRef(metrics);

  // Store unsubscribe objects.
  const [unsubs, setUnsubs] = useState<Array<AnyApi>>([]);
  const unsubsRef = useRef(unsubs);

  // manage unsubscribe
  useEffect(() => {
    initialiseSubscriptions();
    return () => {
      Object.values(unsubsRef.current).forEach((unsub: AnyJson) => {
        unsub();
      });
    };
  }, [isReady]);

  // active subscription
  const initialiseSubscriptions = async () => {
    if (!api) return;

    if (isReady) {
      const subscribeToMetrics = async () => {
        const unsub = await api.queryMulti(
          [
            api.query.balances.totalIssuance,
            api.query.auctions.auctionCounter,
            api.query.paraSessionInfo.earliestStoredSession,
            api.query.fastUnstake.erasToCheckPerBlock,
          ],
          ([
            totalIssuance,
            auctionCounter,
            earliestStoredSession,
            erasToCheckPerBlock,
          ]: AnyApi) => {
            setStateWithRef(
              {
                totalIssuance: new BigNumber(totalIssuance.toString()),
                auctionCounter: new BigNumber(auctionCounter.toString()),
                earliestStoredSession: new BigNumber(
                  earliestStoredSession.toString()
                ),
                fastUnstakeErasToCheckPerBlock: erasToCheckPerBlock.toNumber(),
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
          setStateWithRef(newActiveEra, setActiveEra, activeEraRef);
        });
        return unsub;
      };

      // initiate subscription, add to unsubs.
      await Promise.all([subscribeToMetrics(), subscribeToActiveEra()]).then(
        (u: any) => {
          setStateWithRef([...unsubsRef.current, ...u], setUnsubs, unsubsRef);
        }
      );
    }
  };

  // Set defaults for all metrics.
  const handleResetMetrics = () => {
    setStateWithRef(defaults.activeEra, setActiveEra, activeEraRef);
    setStateWithRef(defaults.metrics, setMetrics, metricsRef);
  };

  // Reset active era and metrics on network change.
  useEffect(() => {
    handleResetMetrics();
  }, [network]);

  return (
    <NetworkMetricsContext.Provider
      value={{
        activeEra: activeEraRef.current,
        metrics: metricsRef.current,
      }}
    >
      {children}
    </NetworkMetricsContext.Provider>
  );
};
