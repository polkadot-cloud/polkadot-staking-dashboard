// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue, varToUrlHash } from '@w3ux/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { NetworkList } from 'config/networks';
import type { NetworkName } from 'types';
import type { NetworkState, NetworkContextInterface } from './types';
import { defaultNetwork, defaultNetworkContext } from './defaults';

export const NetworkContext = createContext<NetworkContextInterface>(
  defaultNetworkContext
);

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  // Get the initial network and prepare meta tags if necessary.
  const getInitialNetwork = () => {
    const urlNetworkRaw = extractUrlValue('n');

    const urlNetworkValid = !!Object.values(NetworkList).find(
      (n) => n.name === urlNetworkRaw
    );

    // use network from url if valid.
    if (urlNetworkValid) {
      const urlNetwork = urlNetworkRaw as NetworkName;

      if (urlNetworkValid) {
        return urlNetwork;
      }
    }
    // fallback to localStorage network if there.
    const localNetwork: NetworkName = localStorage.getItem(
      'network'
    ) as NetworkName;

    const localNetworkValid = !!Object.values(NetworkList).find(
      (n) => n.name === localNetwork
    );

    const initialNetwork = localNetworkValid ? localNetwork : defaultNetwork;

    // Commit initial to local storage.
    localStorage.setItem('network', initialNetwork);

    return initialNetwork;
  };

  // handle network switching
  const switchNetwork = (name: NetworkName) => {
    setNetwork({
      name,
      meta: NetworkList[name],
    });

    // update url `n` if needed.
    varToUrlHash('n', name, false);
  };

  // Store the initial active network.
  const initialNetwork = getInitialNetwork();

  const [network, setNetwork] = useState<NetworkState>({
    name: initialNetwork,
    meta: NetworkList[initialNetwork],
  });

  return (
    <NetworkContext.Provider
      value={{
        network: network.name,
        networkData: network.meta,
        switchNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
