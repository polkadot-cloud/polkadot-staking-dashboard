// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainIcons, NetworkId } from 'types'
import { chainIcons } from './chains'

// Get chain icons as a record of React components
export const getChainIcons = (name: NetworkId): ChainIcons => chainIcons[name]
