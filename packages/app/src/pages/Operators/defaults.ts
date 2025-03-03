// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Item, OperatorsSectionsContextInterface } from './types'

export const operatorItem: Item = {
  name: '',
  icon: '',
  validators: {},
}

export const defaultContext: OperatorsSectionsContextInterface = {
  setActiveSection: (t) => {},
  activeSection: 0,
  activeItem: operatorItem,
  setActiveItem: (item) => {},
  scrollPos: 0,
  setScrollPos: (scrollPos) => {},
}
