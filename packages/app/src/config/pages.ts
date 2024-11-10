// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Community } from 'pages/Community';
import { Nominate } from 'pages/Nominate';
import { Overview } from 'pages/Overview';
import { Payouts } from 'pages/Payouts';
import { Pools } from 'pages/Pools';
import { Validators } from 'pages/Validators';
import type { PageCategoryItems, PagesConfigItems } from 'types';

const BASE_URL = import.meta.env.BASE_URL;
export const PageCategories: PageCategoryItems = [
  {
    id: 1,
    key: 'default',
  },
  {
    id: 2,
    key: 'stake',
  },
  {
    id: 3,
    key: 'validators',
  },
];

export const PagesConfig: PagesConfigItems = [
  {
    category: 1,
    key: 'overview',
    uri: `${BASE_URL}`,
    hash: '/overview',
    Entry: Overview,
    lottie: 'globe',
  },
  {
    category: 2,
    key: 'pools',
    uri: `${BASE_URL}pools`,
    hash: '/pools',
    Entry: Pools,
    lottie: 'groups',
  },
  {
    category: 2,
    key: 'nominate',
    uri: `${BASE_URL}nominate`,
    hash: '/nominate',
    Entry: Nominate,
    lottie: 'trending',
  },
  {
    category: 2,
    key: 'payouts',
    uri: `${BASE_URL}payouts`,
    hash: '/payouts',
    Entry: Payouts,
    lottie: 'analytics',
  },
  {
    category: 3,
    key: 'validators',
    uri: `${BASE_URL}validators`,
    hash: '/validators',
    Entry: Validators,
    lottie: 'view',
  },
  {
    category: 3,
    key: 'community',
    uri: `${BASE_URL}community`,
    hash: '/community',
    Entry: Community,
    lottie: 'label',
  },
];
