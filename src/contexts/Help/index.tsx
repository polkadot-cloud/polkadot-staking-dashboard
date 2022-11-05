// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { MaybeString } from 'types';
import * as defaults from './defaults';
import {
  HelpConfig,
  HelpContextInterface,
  HelpContextProps,
  HelpContextState,
} from './types';

export const HelpContext = React.createContext<HelpContextInterface>(
  defaults.defaultHelpContext
);

export const useHelp = () => React.useContext(HelpContext);

export const HelpProvider = (props: HelpContextProps) => {
  // help module state
  const [state, setState] = useState<HelpContextState>({
    status: 0,
    definition: null,
    config: {},
  });

  // when fade out completes, reset active definiton
  useEffect(() => {
    if (state.status === 0) {
      setState({
        ...state,
        definition: null,
      });
    }
  }, [state, state.status]);

  const setDefinition = (definition: MaybeString) => {
    const _state = {
      ...state,
      definition,
    };
    setState(_state);
  };

  const setStatus = (newStatus: number) => {
    const _state = {
      ...state,
      status: newStatus,
    };
    setState(_state);
  };

  const openHelpWith = (definition: MaybeString, _config: HelpConfig = {}) => {
    setState({
      ...state,
      definition,
      status: 1,
      config: _config,
    });
  };

  const closeHelp = () => {
    setState({
      ...state,
      status: 2,
    });
  };

  return (
    <HelpContext.Provider
      value={{
        openHelpWith,
        closeHelp,
        setStatus,
        setDefinition,
        status: state.status,
        definition: state.definition,
      }}
    >
      {props.children}
    </HelpContext.Provider>
  );
};
