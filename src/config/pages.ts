// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UriPrefix } from 'consts';
import Dashboard from 'pages/Dashboard';
import { HousingCouncil } from 'pages/HousingCouncil';
import { InvestorsView } from 'pages/Investors';
import { NotaryView } from 'pages/Notary';
import { Representative } from 'pages/Representative';
import { Tenants } from 'pages/Tenants';
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
    key: 'Housing Council',
    uri: `${UriPrefix}/`,
    hash: '/council',
    Entry: HousingCouncil,
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
    key: 'Notary',
    uri: `${UriPrefix}/`,
    hash: '/notary',
    Entry: NotaryView,
  },
  {
    category: 1,
    key: 'Tenant Registry',
    uri: `${UriPrefix}/`,
    hash: '/tenants',
    Entry: Tenants,
  },
  {
    category: 1,
    key: 'Representatives',
    uri: `${UriPrefix}/`,
    hash: '/representatives',
    Entry: Representative,
  },
];

export default PAGES_CONFIG;
