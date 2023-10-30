// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePlugins } from 'contexts/Plugins';
import { capitalizeFirstLetter } from '@polkadot-cloud/utils';
import { Wrapper } from './Wrapper';
import type { PluginLabelProps } from './types';

export const PluginLabel = ({ plugin }: PluginLabelProps) => {
  const { plugins } = usePlugins();

  return (
    <Wrapper $active={plugins.includes(plugin)}>
      <FontAwesomeIcon icon={faProjectDiagram} transform="shrink-4" />
      {capitalizeFirstLetter(plugin)}
    </Wrapper>
  );
};
