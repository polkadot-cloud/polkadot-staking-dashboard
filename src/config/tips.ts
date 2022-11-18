// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as helpCenterJson from 'img/json/help-center-outline.json';
import * as infoJson from 'img/json/info-outline.json';

export const TIPS_CONFIG = [
  {
    id: 'connect_extensions',
    meta: {
      segment: 1,
    },
    localeKey: 'connect_extensions',
    icon: infoJson,
  },
  {
    id: 'recommended_nominator',
    meta: {
      segment: 2,
    },
    localeKey: 'recommended_nominator',
    icon: infoJson,
  },
  {
    id: 'recommended_join_pool',
    meta: {
      segment: 3,
    },
    localeKey: 'recommended_join_pool',
    icon: infoJson,
  },
  {
    id: 'how_to_stake',
    meta: {
      segment: 4,
    },
    localeKey: 'how_to_stake',
    icon: helpCenterJson,
  },
  {
    id: 'managing_nominations',
    meta: {
      segment: 5,
    },
    localeKey: 'managing_nominations',
    icon: infoJson,
  },
  {
    id: 'monitoring_pool',
    meta: {
      segment: 6,
    },
    localeKey: 'monitoring_pool',
    icon: infoJson,
  },
  // {
  //   id: 'join_another_pool',
  //   meta: {
  //     segment: 6,
  //   },
  //   title: 'Joining Another Pool',
  //   subtitle: 'Switch to a different account to join another pool.',
  //   description: [
  //     'Only one pool can be joined per account on {NETWORK_NAME}. To join more pools, firstly switch to another account.',
  //   ],
  //   icon: infoJson,
  // },
  {
    id: 'keep_pool_nominating',
    meta: {
      segment: 7,
    },
    localeKey: 'keep_pool_nominating',
    icon: infoJson,
  },
  {
    id: 'reviewing_payouts',
    meta: {
      segment: 8,
    },
    localeKey: 'reviewing_payouts',
    icon: infoJson,
  },
  {
    id: 'understanding_validator_performance',
    meta: {
      segment: 8,
    },
    localeKey: 'understanding_validator_performance',
    icon: infoJson,
  },
];
