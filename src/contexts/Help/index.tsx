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

  // store the current page of assistant
  const [page, _setPage] = useState<string>('overview');

  // to abstract out into individual state items
  const [state, setState] = useState<any>({
    status: 0,
    definition: null,
    config: {},
    height: 0, // remove height function
    resize: 0,
  });

  // new functions

  const setHelpHeight = (h: number) => {
    if (state.status === 0) return;
    // set maximum height to 80% of window height
    const maxHeight = window.innerHeight * 0.8;
    h = h > maxHeight ? maxHeight : h;
    setState({
      ...state,
      height: h,
    });
  };

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
      resize: state.resize + 1,
      height: newStatus === 0 ? 0 : state.height,
    };
    setState(_state);
  };

  const openHelpWith = (definition: string, _config: any = {}) => {
    setState({
      ...state,
      definition,
      status: 1,
      config: _config,
      resize: state.resize + 1,
    });
  };

  const closeHelp = () => {
    setState({
      ...state,
      status: 0,
      definition: null,
    });
  };
  const setPage = (newPage: string) => {
    _setPage(newPage);
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
        setHelpHeight,
        openHelpWith,
        closeHelp,
        setStatus,
        setPage,
        setDefinition,
        fillDefinitionVariables,
        status: state.status,
        height: state.height,
        resize: state.resize,
        definition: state.definition,
        page,
      }}
    >
      {props.children}
    </HelpContext.Provider>
  );
};
