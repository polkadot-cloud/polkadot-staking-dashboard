// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import React, { useState } from 'react';
import { replaceAll } from 'Utils';
import { HelpContextProps, HelpDefinition } from './types';

export const HelpContext = React.createContext<any>(null);

export const useHelp = () => React.useContext(HelpContext);

export const HelpProvider = (props: HelpContextProps) => {
  const { network, consts } = useApi();
  const { maxNominatorRewardedPerValidator } = consts;

  // store the current active help category
  const [category, _setCategory] = useState<string | null>(null);

  // to abstract out into individual state items
  const [state, setState] = useState<any>({
    status: 0,
    definition: null,
    config: {},
  });

  const setDefinition = (definition: string | null) => {
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

  const openHelpWith = (definition: string, _config: any = {}) => {
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
      status: 0,
      definition: null,
    });
  };
  const setCategory = (_category: string) => {
    _setCategory(_category);
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
        setCategory,
        setDefinition,
        fillDefinitionVariables,
        status: state.status,
        definition: state.definition,
        category,
      }}
    >
      {props.children}
    </HelpContext.Provider>
  );
};
