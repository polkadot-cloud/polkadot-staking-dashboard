// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PageCategoryItems, PagesConfigItems } from 'common-types'
import { Home } from 'pages/Home'
import { Nominate } from 'pages/Nominate'
import { Operators } from 'pages/Operators'
import { Overview } from 'pages/Overview'
import { Pools } from 'pages/Pools'
import { Rewards } from 'pages/Rewards'
import { Validators } from 'pages/Validators'

export const PageCategories: PageCategoryItems = [
  {
    id: 1,
    key: 'default',
    advanced: false,
  },
  {
    id: 2,
    key: 'stake',
    advanced: false,
  },
  {
    id: 3,
    key: 'validators',
    advanced: true,
  },
]

export const PagesConfig: PagesConfigItems = [
  {
    category: 1,
    key: 'home',
    uri: `${import.meta.env.BASE_URL}`,
    hash: '/home',
    Entry: Home,
    lottie: 'home',
    advanced: false,
  },
  {
    category: 2,
    key: 'overview',
    uri: `${import.meta.env.BASE_URL}`,
    hash: '/overview',
    Entry: Overview,
    lottie: 'globe',
    advanced: false,
  },
  {
    category: 2,
    key: 'pools',
    uri: `${import.meta.env.BASE_URL}pools`,
    hash: '/pools',
    Entry: Pools,
    lottie: 'groups',
    advanced: false,
  },
  {
    category: 2,
    key: 'nominate',
    uri: `${import.meta.env.BASE_URL}nominate`,
    hash: '/nominate',
    Entry: Nominate,
    lottie: 'trending',
    advanced: false,
  },
  {
    category: 2,
    key: 'rewards',
    uri: `${import.meta.env.BASE_URL}rewards`,
    hash: '/rewards',
    Entry: Rewards,
    lottie: 'analytics',
    advanced: false,
  },
  {
    category: 3,
    key: 'validators',
    uri: `${import.meta.env.BASE_URL}validators`,
    hash: '/validators',
    Entry: Validators,
    lottie: 'view',
    advanced: false,
  },
  {
    category: 3,
    key: 'operators',
    uri: `${import.meta.env.BASE_URL}operators`,
    hash: '/operators',
    Entry: Operators,
    lottie: 'label',
    advanced: false,
  },
]
