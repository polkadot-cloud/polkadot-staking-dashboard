// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Configuration, PolkawatchApi } from '@polkawatch/ddp-client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useApi } from '../../Api';
import type { NetworkName } from '../../../types';

/**
 * This is the Polkawatch API provider, which builds polkawatch API depending on the Chain that is currently
 * in context. Also returns information about whether there exist decentralization analytics for the Network.
 */

const POLKAWATCH_API_VERSION = 'v2';
const POLKAWATCH_NETWORKS = ['polkadot', 'kusama'];

/**
 * Builds the API Configuration based on Chain and API Version
 * @param name the chain to query: polkadot, kusama, etc.
 * @param version the API version
 * @constructor
 */
const apiConfiguration = (
  name: NetworkName = 'polkadot',
  version = POLKAWATCH_API_VERSION
): Configuration =>
  new Configuration({
    basePath: `https://${name}-${version}-api.polkawatch.app`,
  });

/**
 * The provider will return an API and also information about whether the selected network has decentralization
 * analytics support.
 */
interface PolkawatchState {
  pwApi: PolkawatchApi;
  networkSupported: boolean;
}

const PolkawatchInitialState = {
  pwApi: new PolkawatchApi(apiConfiguration()),
  networkSupported: true,
};

const PolkawatchContext = createContext(PolkawatchInitialState);

export const usePolkawatchApi = () => {
  return useContext(PolkawatchContext);
};

export const PolkawatchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<PolkawatchState>(PolkawatchInitialState);
  const { name } = useApi().network;

  /**
   * We update the API object when another network is selected.
   * The api Object is stateless, there is no network or computational
   * cost involved in creating a new API.
   */
  useEffect(() => {
    setState({
      pwApi: new PolkawatchApi(apiConfiguration(name)),
      networkSupported: POLKAWATCH_NETWORKS.includes(name),
    });
  }, [name]);

  return (
    <PolkawatchContext.Provider value={state}>
      {children}
    </PolkawatchContext.Provider>
  );
};
