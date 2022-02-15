import React, { useState, useEffect } from 'react';
import { useApi } from './Api';

// context type
export interface NetworkMetricsContextState {
  metrics: any,
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

  const [activeEra, setActiveEra]: any = useState(0);
  const [blockNumber, setBlockNumber]: any = useState(0);

  useEffect(() => {
    let unsub: any = subscribeToBlockHeads(api);

    return (() => {
      if (unsub != null) {
        for (let u = 0; u < unsub.length; u++) {
          unsub[u]();
        }
      }
    })
  }, [isReady()]);

  // dynamic block number subscription: basic, no unsubscribe
  const subscribeToBlockHeads = async (api: any) => {
    if (isReady()) {

      const unsub1 = await api.rpc.chain.subscribeNewHeads((header: any) => {
        setBlockNumber('#' + header.number.toHuman());
      });

      const unsub2 = await api.query.staking.activeEra((activeEra: any) => {
        setActiveEra(activeEra.toHuman());
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
      },
    }}>
      {props.children}
    </NetworkMetricsContext.Provider>
  );
}