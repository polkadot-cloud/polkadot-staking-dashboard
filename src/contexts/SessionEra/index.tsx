// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useApi } from '../Api';
import * as defaults from './defaults';

export interface SessionEraContextState {
  getEraTimeLeft: () => number;
  sessionEra: any;
}

export const SessionEraContext: React.Context<SessionEraContextState> =
  React.createContext({
    getEraTimeLeft: () => 0,
    sessionEra: {},
  });

// Warning: Do not use this hook in heavy components.
// Using this hook in a component makes the component rerender per each new block.
export const useSessionEra = () => React.useContext(SessionEraContext);

export const SessionEraProvider = (props: any) => {
  const { isReady, api, status, consts }: any = useApi();
  const { expectedBlockTime } = consts;

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

  const getEraTimeLeft = () => {
    let eraBlocksLeft = state.eraLength - state.eraProgress;
    let eraTimeLeftSeconds = eraBlocksLeft * (expectedBlockTime * 0.001);
    let eventTime = moment().unix() + eraTimeLeftSeconds;
    let diffTime = eventTime - moment().unix();
    return diffTime;
  };

  return (
    <SessionEraContext.Provider
      value={{
        getEraTimeLeft: getEraTimeLeft,
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
