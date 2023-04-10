// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UriPrefix } from 'consts';
import { Community } from 'pages/Community';
import { Favorites } from 'pages/Favorites';
import { Nominate } from 'pages/Nominate';
import { Overview } from 'pages/Overview';
import { Payouts } from 'pages/Payouts';
import { Pools } from 'pages/Pools';
import { Validators } from 'pages/Validators';
import type { PageCategoryItems, PagesConfigItems } from 'types';

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
    uri: `${UriPrefix}/`,
    hash: '/overview',
    Entry: Overview,
    lottie: 'globe',
  },
  {
    category: 2,
    key: 'pools',
    uri: `${UriPrefix}/pools`,
    hash: '/pools',
    Entry: Pools,
    lottie: 'groups',
  },
  {
    category: 2,
    key: 'nominate',
    uri: `${UriPrefix}/nominate`,
    hash: '/nominate',
    Entry: Nominate,
    lottie: 'trending',
  },
  {
    category: 2,
    key: 'payouts',
    uri: `${UriPrefix}/payouts`,
    hash: '/payouts',
    Entry: Payouts,
    lottie: 'analytics',
  },
  {
    category: 3,
    key: 'validators',
    uri: `${UriPrefix}/validators`,
    hash: '/validators',
    Entry: Validators,
    lottie: 'view',
  },
  {
    category: 3,
    key: 'community',
    uri: `${UriPrefix}/community`,
    hash: '/community',
    Entry: Community,
    lottie: 'label',
  },
  {
    category: 3,
    key: 'favorites',
    uri: `${UriPrefix}/favorites`,
    hash: '/favorites',
    Entry: Favorites,
    lottie: 'heart',
  },
];
