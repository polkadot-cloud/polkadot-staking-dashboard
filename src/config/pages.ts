// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import Overview from 'pages/Overview';
import Nominate from 'pages/Nominate';
import Pools from 'pages/Pools';
import Browse from 'pages/Validators';
import Favorites from 'pages/Favorites';
import Payouts from 'pages/Payouts';
import Community from 'pages/Community';
import { URI_PREFIX } from 'consts';
import { PageCategories, PagesConfig } from 'types';
import * as analyticsJson from 'img/json/analytics-solid.json';
import * as viewAgendaJson from 'img/json/view-agenda-solid.json';
import * as view1SolidJson from 'img/json/view-1-solid.json';
import * as viewGroupJson from 'img/json/groups-solid-edited.json';
import * as viewTrendingUpJson from 'img/json/trending-up-solid.json';
import * as favoriteHeartJson from 'img/json/favorite-heart-solid.json';

export const PAGE_CATEGORIES: PageCategories = [
  {
    _id: 1,
    key: 'default',
  },
  {
    _id: 2,
    key: 'stake',
  },
  {
    _id: 3,
    key: 'validators',
  },
];

export const PAGES_CONFIG: PagesConfig = [
  {
    category: 1,
    key: 'overview',
    uri: `${URI_PREFIX}/`,
    hash: '/overview',
    Entry: Overview,
    animate: view1SolidJson,
  },
  {
    category: 2,
    key: 'solo',
    uri: `${URI_PREFIX}/solo`,
    hash: '/solo',
    Entry: Nominate,
    animate: viewTrendingUpJson,
  },
  {
    category: 2,
    key: 'pools',
    uri: `${URI_PREFIX}/pools`,
    hash: '/pools',
    Entry: Pools,
    animate: viewGroupJson,
  },
  {
    category: 2,
    key: 'payouts',
    uri: `${URI_PREFIX}/payouts`,
    hash: '/payouts',
    Entry: Payouts,
    animate: analyticsJson,
  },
  {
    category: 3,
    key: 'validators',
    uri: `${URI_PREFIX}/validators`,
    hash: '/validators',
    Entry: Browse,
    animate: viewAgendaJson,
  },
  {
    category: 3,
    key: 'community',
    uri: `${URI_PREFIX}/community`,
    hash: '/community',
    Entry: Community,
    icon: faHashtag,
  },
  {
    category: 3,
    key: 'favourites',
    uri: `${URI_PREFIX}/favorites`,
    hash: '/favorites',
    Entry: Favorites,
    animate: favoriteHeartJson,
  },
];

export default PAGES_CONFIG;
