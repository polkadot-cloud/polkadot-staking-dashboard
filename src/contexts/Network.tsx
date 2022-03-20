// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
export const NetworkMetricsContextWrapper = (props: any) => {

  const { isReady, api }: any = useApi();

  const [state, setState]: any = useState({
    now: 0,
    activeEra: {
      index: 0,
      start: 0,
    },
    unsub: undefined,
  });

  // manage unsubscribe
  useEffect(() => {
    subscribeToNetworkMetrics(api);
    return (() => {
      if (state.unsub !== undefined) {
        state.unsub();
      }
    })
  }, [isReady()]);

  // active subscription
  const subscribeToNetworkMetrics = async (api: any) => {
    if (isReady()) {

      const unsub = await api.queryMulti([
        api.query.staking.activeEra,
      ], ([activeEra]: any) => {

        let _state = {};

        // determine activeEra: toString used as alternative to `toHuman`, that puts commas in numbers
        let _activeEra = activeEra.unwrapOrDefault({
          index: 0,
          start: 0
        }).toString();

        // convert JSON string to object
        _activeEra = JSON.parse(_activeEra);

        _state = {
          ..._state,
          activeEra: _activeEra,
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
        now: state.now,
        activeEra: state.activeEra,
      }
    }}>
      {props.children}
    </NetworkMetricsContext.Provider>
  );
}