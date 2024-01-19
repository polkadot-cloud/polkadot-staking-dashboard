// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useState } from 'react';
import type { MaybeString } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import * as defaults from './defaults';
import type {
  HelpContextInterface,
  HelpContextProps,
  HelpContextState,
  HelpStatus,
} from './types';

export const HelpContext = createContext<HelpContextInterface>(
  defaults.defaultHelpContext
);

export const useHelp = () => useContext(HelpContext);

export const HelpProvider = ({ children }: HelpContextProps) => {
  // help module state
  const [state, setState] = useState<HelpContextState>({
    status: 'closed',
    definition: null,
  });

  // when fade out completes, reset active definition
  useEffectIgnoreInitial(() => {
    if (state.status === 'closed') {
      setState({
        ...state,
        definition: null,
      });
    }
  }, [state.status]);

  const setDefinition = (definition: MaybeString) => {
    setState({
      ...state,
      definition,
    });
  };

  const setStatus = (newStatus: HelpStatus) => {
    setState({
      ...state,
      status: newStatus,
    });
  };

  const openHelp = (definition: MaybeString) => {
    setState({
      ...state,
      definition,
      status: 'open',
    });
  };

  const closeHelp = () => {
    setState({
      ...state,
      status: 'closing',
    });
  };

  return (
    <HelpContext.Provider
      value={{
        openHelp,
        closeHelp,
        setStatus,
        setDefinition,
        status: state.status,
        definition: state.definition,
      }}
    >
      {children}
    </HelpContext.Provider>
  );
};
