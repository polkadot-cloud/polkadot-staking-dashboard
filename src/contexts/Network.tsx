// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { useApi } from './Api';

// context type
export interface NetworkMetricsContextState {
  metrics: any;
}

// context definition
export const NetworkMetricsContext: React.Context<NetworkMetricsContextState> = React.createContext({
  metrics: {},
});

// useNetworkMetrics
export const useNetworkMetrics = () => React.useContext(NetworkMetricsContext);

// wrapper component to provide components with context
export const NetworkMetricsProvider = (props: any) => {

  const { isReady, api, status }: any = useApi();

  const defaultState = {
    activeEra: {
      index: 0,
      start: 0,
    },
    totalIssuance: 0,
    unsub: undefined,
  };

  useEffect(() => {
    if (status === 'connecting') {
      setState(defaultState);
    }
  }, [status]);

  // store network metrics in state
  const [state, setState]: any = useState(defaultState);

  // manage unsubscribe
  useEffect(() => {
    subscribeToNetworkMetrics();
    return (() => {
      if (state.unsub !== undefined) {
        state.unsub();
      }
    })
  }, [isReady]);

  // active subscription
  const subscribeToNetworkMetrics = async () => {
    if (isReady) {

      const unsub = await api.queryMulti([
        api.query.staking.activeEra,
        api.query.balances.totalIssuance,
      ], ([activeEra, _totalIssuance]: any) => {

        let _state = {};

        // determine activeEra: toString used as alternative to `toHuman`, that puts commas in numbers
        let _activeEra = activeEra.unwrapOrDefault({
          index: 0,
          start: 0
        }).toString();

        // convert JSON string to object
        _activeEra = JSON.parse(_activeEra);

        // get total issuance
        _totalIssuance = _totalIssuance.toBn().div((new BN(10 ** 10))).toNumber();

        _state = {
          ..._state,
          activeEra: _activeEra,
          totalIssuance: _totalIssuance,
        };
        setState(_state);
      });

      return unsub;
    }
    return undefined;
  }

  return (
    <NetworkMetricsContext.Provider value={{
      metrics: {
        activeEra: state.activeEra,
        totalIssuance: state.totalIssuance,
      }
    }}>
      {props.children}
    </NetworkMetricsContext.Provider>
  );
}