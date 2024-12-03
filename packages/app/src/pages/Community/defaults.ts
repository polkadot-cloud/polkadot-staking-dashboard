// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { CommunitySectionsContextInterface, Item } from './types'

export const communityItem: Item = {
  name: '',
  icon: '',
  validators: {},
}

export const defaultContext: CommunitySectionsContextInterface = {
  setActiveSection: (t) => {},
  activeSection: 0,
  activeItem: communityItem,
  setActiveItem: (item) => {},
  scrollPos: 0,
  setScrollPos: (scrollPos) => {},
}
