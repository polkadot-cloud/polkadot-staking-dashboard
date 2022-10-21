// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { UriPrefix } from 'consts';
import * as analyticsJson from 'img/json/analytics-solid.json';
import * as favoriteHeartJson from 'img/json/favorite-heart-solid.json';
import * as viewGroupJson from 'img/json/groups-solid.json';
import * as viewTrendingUpJson from 'img/json/trending-up-solid.json';
import * as view1SolidJson from 'img/json/view-1-solid.json';
import * as viewAgendaJson from 'img/json/view-agenda-solid.json';
import Community from 'pages/Community';
import Favorites from 'pages/Favorites';
import Nominate from 'pages/Nominate';
import Overview from 'pages/Overview';
import Payouts from 'pages/Payouts';
import Pools from 'pages/Pools';
import Browse from 'pages/Validators';
import { PageCategories, PagesConfig } from 'types';

export const PAGE_CATEGORIES: PageCategories = [
  {
    _id: 1,
    title: 'default',
  },
  {
    _id: 2,
    title: 'Stake',
  },
  {
    _id: 3,
    title: 'Validators',
  },
];

export const PAGES_CONFIG: PagesConfig = [
  {
    category: 1,
    title: 'Overview',
    uri: `${UriPrefix}/`,
    hash: '/overview',
    Entry: Overview,
    animate: view1SolidJson,
  },
  {
    category: 2,
    title: 'Nominate',
    uri: `${UriPrefix}/nominate`,
    hash: '/nominate',
    Entry: Nominate,
    animate: viewTrendingUpJson,
  },
  {
    category: 2,
    title: 'Pools',
    uri: `${UriPrefix}/pools`,
    hash: '/pools',
    Entry: Pools,
    animate: viewGroupJson,
  },
  {
    category: 2,
    title: 'Payouts',
    uri: `${UriPrefix}/payouts`,
    hash: '/payouts',
    Entry: Payouts,
    animate: analyticsJson,
  },
  {
    category: 3,
    title: 'Validators',
    uri: `${UriPrefix}/validators`,
    hash: '/validators',
    Entry: Browse,
    animate: viewAgendaJson,
  },
  {
    category: 3,
    title: 'Community',
    uri: `${UriPrefix}/community`,
    hash: '/community',
    Entry: Community,
    icon: faHashtag,
  },
  {
    category: 3,
    title: 'Favorites',
    uri: `${UriPrefix}/favorites`,
    hash: '/favorites',
    Entry: Favorites,
    animate: favoriteHeartJson,
  },
];

export default PAGES_CONFIG;
