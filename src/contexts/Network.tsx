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

  const [activeEra, setActiveEra]: any = useState({
    index: 0,
    start: 0,
  });
  const [blockNumber, setBlockNumber]: any = useState(0);

  useEffect(() => {
    let unsub: any = subscribeToNetworkMetrics(api);

    return (() => {
      if (unsub != null) {
        for (let u = 0; u < unsub.length; u++) {
          unsub[u]();
        }
      }
    })
  }, [isReady()]);

  // dynamic block number subscription: basic, no unsubscribe
  const subscribeToNetworkMetrics = async (api: any) => {
    if (isReady()) {

      // get new block heads
      const unsub1 = await api.rpc.chain.subscribeNewHeads((header: any) => {
        setBlockNumber('#' + header.number.toHuman());
      });

      // get active era
      const unsub2 = await api.query.staking.activeEra((activeEra: any) => {

        // determine activeEra: toString used as alternative to `toHuman`, that puts commas in numbers
        let _activeEra = activeEra.unwrapOrDefault({
          index: 0,
          start: 0
        }).toString();

        // convert JSON string to object
        _activeEra = JSON.parse(_activeEra);

        setActiveEra(_activeEra);
      });

      return [unsub1, unsub2];
    }
    return null;
  }

  return (
    <NetworkMetricsContext.Provider value={{
      metrics: {
        blockNumber: blockNumber,
        activeEra: activeEra,
      }
    }}>
      {props.children}
    </NetworkMetricsContext.Provider>
  );
}