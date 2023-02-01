// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UriPrefix } from 'consts';
import Dashboard from 'pages/Dashboard';
import { InvestorsView } from 'pages/Investors';
import { PageCategories, PagesConfig } from 'types';

export const PAGE_CATEGORIES: PageCategories = [
  {
    id: 1,
    key: 'default',
  },
];

export const PAGES_CONFIG: PagesConfig = [
  {
    category: 1,
    key: 'Dashboard',
    uri: `${UriPrefix}/`,
    hash: '/dashboard',
    Entry: Dashboard,
  },
  {
    category: 1,
    key: 'Investors',
    uri: `${UriPrefix}/`,
    hash: '/investors',
    Entry: InvestorsView,
  },
  {
    category: 1,
    key: 'Sellers',
    uri: `${UriPrefix}/`,
    hash: '/sellers',
    Entry: Dashboard,
  },
  {
    category: 1,
    key: 'Tenant Registry',
    uri: `${UriPrefix}/`,
    hash: '/tenants',
    Entry: Dashboard,
  },
  {
    category: 1,
    key: 'Toolbox',
    uri: `${UriPrefix}/`,
    hash: '/toolbox',
    Entry: Dashboard,
  },
];

export default PAGES_CONFIG;
