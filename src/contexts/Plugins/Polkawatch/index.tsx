// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PolkawatchApi } from '@polkawatch/ddp-client';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNetwork } from 'contexts/Network';
import type { PolkawatchState } from './types';
import { DefaultNetwork } from '../../../consts';
import { PolkaWatchController } from 'static/PolkaWatchController';

/**
 * This is the Polkawatch API provider, which builds polkawatch API depending on the Chain that is currently
 * in context. Also returns information about whether there exist decentralization analytics for the Network.
 */

const PolkawatchInitialState = {
  pwApi: new PolkawatchApi(PolkaWatchController.apiConfig(DefaultNetwork)),
};

const PolkawatchContext = createContext<PolkawatchState>(
  PolkawatchInitialState
);

export const usePolkawatchApi = () => useContext(PolkawatchContext);

export const PolkawatchProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();

  const [state, setState] = useState<PolkawatchState>(PolkawatchInitialState);

  /**
   * We update the API object when another network is selected. The api Object is stateless, there
   * is no network or computational cost involved in creating a new API.
   */
  useEffect(() => {
    setState({
      pwApi: new PolkawatchApi(PolkaWatchController.apiConfig(network)),
    });
  }, [network]);

  return (
    <PolkawatchContext.Provider value={state}>
      {children}
    </PolkawatchContext.Provider>
  );
};
