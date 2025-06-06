// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isOperatorsSupported } from 'consts/util'
import type { NetworkId } from 'types'
import { PagesConfig } from './pages'

// Get pages config, and remove operators page if it is not supported
export const getPagesConfig = (network: NetworkId, advancedMode: boolean) => {
  const operatorsSupported = isOperatorsSupported(network)

  let pagesConfig = !operatorsSupported
    ? PagesConfig.filter((page) => page.key === 'operators')
    : PagesConfig

  if (!advancedMode) {
    pagesConfig = pagesConfig.filter(({ advanced }) => !advanced)
  }
  return pagesConfig
}
