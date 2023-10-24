// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Configuration, PolkawatchApi } from '@polkawatch/ddp-client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { localStorageOrDefault } from '@polkadot-cloud/utils';
import { useNetwork } from 'contexts/Network';
import type { NetworkName } from '../../../types';
import type { PolkawatchState } from './types';
import { DefaultNetwork } from '../../../consts';
import { PolkaWatchApiVersion, PolkaWatchNetworks } from './defaults';

/**
 * This is the Polkawatch API provider, which builds polkawatch API depending on the Chain that is currently
 * in context. Also returns information about whether there exist decentralization analytics for the Network.
 */

/**
 * Builds the API Configuration based on Chain and API Version
 * @param name the chain to query: polkadot, kusama, etc.
 * @param version the API version
 * @constructor
 */
const apiConfiguration = (
  name: NetworkName = localStorageOrDefault(
    'network',
    DefaultNetwork
  ) as NetworkName,
  version = PolkaWatchApiVersion
): Configuration =>
  new Configuration({
    basePath: `https://${name}-${version}-api.polkawatch.app`,
  });

const PolkawatchInitialState = {
  pwApi: new PolkawatchApi(apiConfiguration()),
  networkSupported: true,
};

export const PolkawatchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network } = useNetwork();

  const [state, setState] = useState<PolkawatchState>(PolkawatchInitialState);

  /**
   * We update the API object when another network is selected. The api Object is stateless, there
   * is no network or computational cost involved in creating a new API.
   */
  useEffect(() => {
    setState({
      pwApi: new PolkawatchApi(apiConfiguration(network)),
      networkSupported: PolkaWatchNetworks.includes(network),
    });
  }, [network]);

  return (
    <PolkawatchContext.Provider value={state}>
      {children}
    </PolkawatchContext.Provider>
  );
};

const PolkawatchContext = createContext<PolkawatchState>(
  PolkawatchInitialState
);

export const usePolkawatchApi = () => useContext(PolkawatchContext);
