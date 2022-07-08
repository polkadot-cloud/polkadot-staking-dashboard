// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Toggle } from 'types';
import {
  AssistantContextInterface,
  AssistantDefinition,
  AssistantItem,
  AssistantContextProps,
} from 'contexts/Assistant/types';
import { ASSISTANT_CONFIG } from 'config/assistant';
import { replaceAll } from 'Utils';
import { useApi } from '../Api';
import { defaultAssistantContext } from './defaults';

export const AssistantContext = React.createContext<AssistantContextInterface>(
  defaultAssistantContext
);

export const useAssistant = () => React.useContext(AssistantContext);

export const AssistantProvider = (props: AssistantContextProps) => {
  const { network, consts } = useApi();
  const { maxNominatorRewardedPerValidator } = consts;

  // store whether assistant is open and whether it should transition
  const [open, setOpen] = useState<{
    state: Toggle;
    transition: number;
  }>({
    state: Toggle.Closed,
    transition: 0,
  });

  // store the current page of assistant
  const [page, _setPage] = useState<string>('overview');

  // store the active section of assistant (home or item)
  const [section, setSection] = useState<number>(0);

  // store assistant height
  const [height, setHeight] = useState<number>(0);

  // store currently active inner definition of assistant
  const [innerDefinition, _setInnerDefinition] = useState<AssistantDefinition>({
    title: '',
    description: [''],
  });

  const fillDefinitionVariables = (d: AssistantDefinition) => {
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

  const setPage = (newPage: string) => {
    _setPage(newPage);
  };

  const getDefinition = (key: string, title: string) => {
    const definition = ASSISTANT_CONFIG.find(
      (item: AssistantItem) => item.key === key
    )?.definitions?.find((item: AssistantDefinition) => item.title === title);

    if (definition === undefined) {
      return undefined;
    }
    return fillDefinitionVariables(definition);
  };

  const setInnerDefinition = (meta: AssistantDefinition) => {
    meta = fillDefinitionVariables(meta);
    _setInnerDefinition(meta);
  };

  const toggle = () => {
    setOpen({
      state: Toggle.Closed ? Toggle.Open : Toggle.Closed,
      transition: 0,
    });
  };

  const openAssistant = () => {
    setOpen({
      state: Toggle.Open,
      transition: 0,
    });
  };

  const closeAssistant = () => {
    setOpen({
      state: Toggle.Closed,
      transition: 0,
    });

    // short timeout to hide back to list
    setTimeout(() => {
      setSection(0);
    }, 150);
  };

  const setActiveSection = (index: number) => {
    setOpen({
      state: open.state,
      transition: 1,
    });
    setSection(index);
  };

  const goToDefinition = (_page: string, _title: string) => {
    const definition = getDefinition(_page, _title);

    // close assistant if the same definition is being toggled.
    if (
      innerDefinition.title === definition?.title &&
      open.state === Toggle.Open
    ) {
      closeAssistant();
    }
    // if definition exists, prepare assistant to display it
    else if (definition !== undefined) {
      // if already open, disable transition
      if (open.state === Toggle.Open) {
        setOpen({
          state: open.state,
          transition: 0,
        });
      } else {
        // open assistant if closed
        setTimeout(() => openAssistant(), 60);
      }
      // ensure on definition page
      setSection(1);
      // apply definition
      setInnerDefinition(definition);
    }
  };

  const setAssistantHeight = (h: number) => {
    setHeight(h);
  };

  return (
    <AssistantContext.Provider
      value={{
        fillDefinitionVariables,
        toggle,
        setPage,
        setInnerDefinition,
        getDefinition,
        openAssistant,
        closeAssistant,
        setActiveSection,
        goToDefinition,
        setAssistantHeight,
        height,
        page,
        innerDefinition,
        activeSection: section,
        open: open.state,
        transition: open.transition,
      }}
    >
      {props.children}
    </AssistantContext.Provider>
  );
};
