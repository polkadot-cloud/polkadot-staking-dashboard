// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useApi } from '../Api';
import * as defaults from './defaults';

export interface SessionEraContextState {
  sessionEra: any;
}

export const SessionEraContext: React.Context<SessionEraContextState> =
  React.createContext({
    sessionEra: {},
  });

export const useSessionEra = () => React.useContext(SessionEraContext);

export const SessionEraProvider = (props: any) => {
  const { isReady, api, status }: any = useApi();

  useEffect(() => {
    if (status === 'connecting') {
      setState(defaults.state);
    }
  }, [status]);

  // store network metrics in state
  const [state, setState]: any = useState(defaults.state);

  // manage unsubscribe
  useEffect(() => {
    subscribeToSessionProgress();
    return () => {
      if (state.unsub !== undefined) {
        state.unsub();
      }
    };
  }, [isReady]);

  // active subscription
  const subscribeToSessionProgress = async () => {
    if (isReady) {
      const unsub = await api.derive.session.progress((session: any) => {
        let _state = {
          eraLength: session.eraLength.toNumber(),
          eraProgress: session.eraProgress.toNumber(),
          sessionLength: session.sessionLength.toNumber(),
          sessionProgress: session.sessionProgress.toNumber(),
          sessionsPerEra: session.sessionsPerEra.toNumber(),
          unsub,
        };
        setState(_state);
      });
      return unsub;
    }
    return undefined;
  };

  return (
    <SessionEraContext.Provider
      value={{
        sessionEra: {
          eraLength: state.eraLength,
          eraProgress: state.eraProgress,
          sessionLength: state.sessionLength,
          sessionProgress: state.sessionProgress,
          sessionsPerEra: state.sessionsPerEra,
        },
      }}
    >
      {props.children}
    </SessionEraContext.Provider>
  );
};
