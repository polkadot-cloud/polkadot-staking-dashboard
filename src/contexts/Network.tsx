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
    subscribeToBlockHeads(api);
  }, [api]);

  // dynamic block number subscription: basic, no unsubscribe
  const subscribeToBlockHeads = async (api: any) => {
    if (isReady()) {

      await api.rpc.chain.subscribeNewHeads((header: any) => {
        setBlockNumber('#' + header.number.toHuman());
      });

      await api.query.staking.activeEra((activeEra: any) => {
        setActiveEra(activeEra.toHuman());
      });
    }
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