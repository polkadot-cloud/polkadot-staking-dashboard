// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faUserFriends,
  faServer,
  faChartLine,
  faStar,
  faUsers,
  faThumbtack,
  faComment,
  faBraille,
} from '@fortawesome/free-solid-svg-icons';
import Overview from '../pages/Overview';
import Stake from '../pages/Stake';
import Pools from '../pages/Pools';
import Browse from '../pages/Validators';
import Favourites from '../pages/Favourites';
import Payouts from '../pages/Payouts';
import Projects from '../pages/explore/Projects';
import Feedback from '../pages/explore/Feedback';
import { URI_PREFIX } from '../consts';
import { PageCategories, PagesConfig } from '../types';

export const PAGE_CATEGORIES: PageCategories = [
  {
    _id: 1,
    title: 'default',
  },
  {
    _id: 2,
    title: 'Staking',
  },
  {
    _id: 3,
    title: 'Validators',
  },
  {
    _id: 4,
    title: 'Explore',
  },
  {
    _id: 5,
    title: 'Feedback',
  },
];

export const PAGES_CONFIG: PagesConfig = [
  {
    category: 1,
    title: 'Overview',
    uri: `${URI_PREFIX}/`,
    hash: '/overview',
    Entry: Overview,
    icon: faBraille,
  },
  {
    category: 2,
    title: 'Stake',
    uri: `${URI_PREFIX}/stake`,
    hash: '/stake',
    Entry: Stake,
    icon: faChartLine,
  },
  {
    category: 2,
    title: 'Pools',
    uri: `${URI_PREFIX}/pools`,
    hash: '/pools',
    Entry: Pools,
    icon: faUsers,
  },
  {
    category: 2,
    title: 'Payouts',
    uri: `${URI_PREFIX}/payouts`,
    hash: '/payouts',
    Entry: Payouts,
    icon: faStar,
  },
  {
    category: 3,
    title: 'Validators',
    uri: `${URI_PREFIX}/validators`,
    hash: '/validators',
    Entry: Browse,
    icon: faServer,
  },
  {
    category: 3,
    title: 'Favourites',
    uri: `${URI_PREFIX}/favourites`,
    hash: '/favourites',
    Entry: Favourites,
    icon: faThumbtack,
  },
  {
    category: 4,
    title: 'Community',
    uri: `${URI_PREFIX}/community`,
    hash: '/community',
    Entry: Projects,
    icon: faUserFriends,
  },
  {
    category: 5,
    title: 'Feedback',
    uri: `${URI_PREFIX}/feedback`,
    hash: '/feedback',
    Entry: Feedback,
    icon: faComment,
  },
];

export default PAGES_CONFIG;
