// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BaseURL } from 'consts';
import { Community } from 'pages/Community';
import { Nominate } from 'pages/Nominate';
import { Overview } from 'pages/Overview';
import { Payouts } from 'pages/Payouts';
import { Validators } from 'pages/Validators';
import type { PageCategoryItems, PagesConfigItems } from 'types';
import { ReactComponent as CommunityIcon } from '../img/ic_community.svg';
import { ReactComponent as NominateIcon } from '../img/ic_nominate.svg';
import { ReactComponent as OverviewIcon } from '../img/ic_overview.svg';
import { ReactComponent as PayoutsIcon } from '../img/ic_payouts.svg';
import { ReactComponent as ValidatorsIcon } from '../img/ic_validators.svg';

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
    uri: `${BaseURL}/`,
    hash: '/overview',
    Entry: Overview,
    icon: () => <OverviewIcon width="13.5" height="11.7" />,
  },
  // Removed temporarily until there is a demand pools
  // {
  //   category: 2,
  //   key: 'pools',
  //   uri: `${BaseURL}/pools`,
  //   hash: '/pools',
  //   Entry: Pools,
  //   icon: () => (<PoolsIcon height={'12.6'} width={'12.6'}/>)
  // },
  {
    category: 2,
    key: 'nominate',
    uri: `${BaseURL}/nominate`,
    hash: '/nominate',
    Entry: Nominate,
    icon: () => <NominateIcon width="12.6" height="7.2" />,
  },
  {
    category: 2,
    key: 'payouts',
    uri: `${BaseURL}/payouts`,
    hash: '/payouts',
    Entry: Payouts,
    icon: () => <PayoutsIcon width="12.6" height="10.8" />,
  },
  {
    category: 3,
    key: 'validators',
    uri: `${BaseURL}/validators`,
    hash: '/validators',
    Entry: Validators,
    icon: () => <ValidatorsIcon width="12.6" height="12.6" />,
  },
  {
    category: 3,
    key: 'community',
    uri: `${BaseURL}/community`,
    hash: '/community',
    Entry: Community,
    icon: () => <CommunityIcon width="12.6" height="11.7" />,
  },
];
