// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { capitalizeFirstLetter } from '@w3ux/utils'
import { usePlugins } from 'contexts/Plugins'
import { Wrapper } from './Wrapper'
import type { PluginLabelProps } from './types'

export const PluginLabel = ({ plugin }: PluginLabelProps) => {
  const { plugins } = usePlugins()

  return (
    <Wrapper $active={plugins.includes(plugin)}>
      <FontAwesomeIcon icon={faProjectDiagram} transform="shrink-4" />
      {capitalizeFirstLetter(plugin)}
    </Wrapper>
  )
}
