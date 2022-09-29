// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import React, { useState } from 'react';
import { replaceAll } from 'Utils';
import { MaybeString } from 'types';
import {
  HelpConfig,
  HelpContextInterface,
  HelpContextProps,
  HelpContextState,
  HelpDefinition,
} from './types';
import * as defaults from './defaults';

export const HelpContext = React.createContext<HelpContextInterface>(
  defaults.defaultHelpContext
);

export const useHelp = () => React.useContext(HelpContext);

export const HelpProvider = (props: HelpContextProps) => {
  const { network, consts } = useApi();
  const { maxNominations, maxNominatorRewardedPerValidator } = consts;

  // help module state
  const [state, setState] = useState<HelpContextState>({
    status: 0,
    definition: null,
    config: {},
  });

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
      definition: null,
    });
  };

  const fillDefinitionVariables = (d: HelpDefinition) => {
    let { title, description } = d;

    const varsToValues = [
      ['{NETWORK_UNIT}', network.unit],
      ['{NETWORK_NAME}', network.name],
      [
        '{MAX_NOMINATOR_REWARDED_PER_VALIDATOR}',
        String(maxNominatorRewardedPerValidator),
      ],
      ['{MAX_NOMINATIONS}', String(maxNominations)],
    ];

    for (const varToVal of varsToValues) {
      title = replaceAll(title, varToVal[0], varToVal[1]);
      description = description.map((_d: string) =>
        replaceAll(_d, varToVal[0], varToVal[1])
      );
    }

    return {
      title,
      description,
    };
  };

  return (
    <HelpContext.Provider
      value={{
        openHelpWith,
        closeHelp,
        setStatus,
        setDefinition,
        fillDefinitionVariables,
        status: state.status,
        definition: state.definition,
      }}
    >
      {props.children}
    </HelpContext.Provider>
  );
};
