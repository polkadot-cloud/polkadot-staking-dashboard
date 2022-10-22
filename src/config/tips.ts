// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import * as infoJson from 'img/json/info-outline.json';
import * as helpCenterJson from 'img/json/help-center-outline.json';

export const TIPS_CONFIG = [
  {
    id: 'connect_extensions',
    meta: {
      segment: 1,
    },
    label: 'Setup',
    title: 'Connect Extensions',
    subtitle: 'Connect your accounts to begin using staking dashboard.',
    description: [
      'Connect your accounts to begin using Polkadot staking dashboard.',
      'Accounts are accessed via web extensions, that act as wallets. Your wallet is used to sign transactions that you submit within the dashboard.',
      'Connect your wallets from the Connect button at the top right of the dashboard, and select the account you wish to stake with to continue.',
      'Staking dashboard supports a range of extensions and wallets.',
    ],
    icon: infoJson,
  },
  {
    id: 'how_to_stake',
    meta: {
      segment: 2,
    },
    label: 'Setup',
    title: 'How Would You Like to Stake?',
    subtitle: 'Learn about the different ways to stake on {NETWORK_NAME}.',
    description: [
      'There are multiple ways to stake on {NETWORK_NAME}.',
      'You can either become a nominator or become a member of a pool.',
      'Directly nominating requires you to bond {NETWORK_UNIT} and choose validators you wish to back, and to nominate up to {MAX_NOMINATIONS} of them. To earn rewards as a nominator, you currently need to bond at least {MIN_ACTIVE_BOND} {NETWORK_UNIT}.',
      'Joining a pool is much cheaper, requiring a minimum deposit of {MIN_POOL_JOIN_BOND} {NETWORK_UNIT}. Nominating validators is done on your behalf, and you simply claim rewards from the pool.',
      'Creating a pool is also possible, requiring a minimum of {MIN_POOL_CREATE_BOND} {NETWORK_UNIT}.',
    ],
    icon: helpCenterJson,
  },
  {
    id: 'recommended_nominator',
    meta: {
      segment: 3,
    },
    label: 'Nominator',
    title: 'Recommended: Become a Nominator',
    subtitle: 'You have enough {NETWORK_UNIT} to become a nominator.',
    description: [
      'You have enough {NETWORK_UNIT} to become a nominator and start earning rewards.',
      'Nominating directly does however require you to actively check your backed validators.',
    ],
    icon: infoJson,
  },
  {
    id: 'recommended_join_pool',
    meta: {
      segment: 4,
    },
    label: 'Pools',
    title: 'Recommended: Join a Pool',
    subtitle: 'Your account is best suited to join a pool.',
    description: [
      'Based on the amount of {NETWORK_UNIT} your account currently holds, joining a pool is the best way for you to start staking.',
    ],
    icon: infoJson,
  },
  {
    id: 'managing_nominations',
    meta: {
      segment: 5,
    },
    label: 'Nominator',
    title: 'Manage Your Nominations',
    subtitle:
      'Regularly check back to see how your nominations are performing.',
    description: [
      'Be sure to check the performance of your nominations on a regular basis.',
      'To maximise variety and a decentralised mix of validators, choose validators from a range of entities.',
    ],
    icon: infoJson,
  },
  {
    id: 'monitoring_pool',
    meta: {
      segment: 6,
    },
    label: 'Pools',
    title: 'Manage Your Pool Membership',
    subtitle: 'Monitor the performance of your pool.',
    description: [
      'Pools will manage nominations on your behalf, but it is still a good idea to check regularly whether your pool is actively earning rewards.',
      "Monitor your pool's status to ensure that it is performing well regularly, and consider joining another pool if you are not receiving any rewards.",
    ],
    icon: infoJson,
  },
  {
    id: 'keep_pool_nominating',
    meta: {
      segment: 7,
    },
    label: 'Pools',
    title: 'Managing Your Pool',
    subtitle: "Keep on top of your pool's performance.",
    description: [
      'It is important to keep your pool actively nominating.',
      'If your pool is not earning rewards, members will be tempted to leave and join another pool.',
      "Your root and nominator roles are important for managing your nominations. If nominations are not performing well, choose different ones to increase your pool's chances of earning rewards.",
    ],
    icon: infoJson,
  },
  {
    id: 'reviewing_payouts',
    meta: {
      segment: 8,
    },
    label: 'Payouts',
    title: 'Review Payouts',
    subtitle: 'Keep track of payout frequency and amount you receive.',
    description: [
      'Regularly reviewing your Payouts is a good way to gauge how well your nominations are performing.',
      'Go to the Payouts page to get a detailed breakdown of each payout you receive, and by which validator (or pool) the payout came from.',
    ],
    icon: infoJson,
  },
  {
    id: 'understanding_validator_performance',
    meta: {
      segment: 8,
    },
    label: 'Validators',
    title: 'Measure Validator Performance Regularly',
    subtitle: 'Many factors determine how validators perform.',
    description: [
      'Various factors of a validator will affect how much they are rewarded, such as the amount of era points it generates, how many nominators are backing it, and whether it is over subscribed.',
      'All these metrics change over time, sometimes in an unpredictable manner.It is therefore important that nominators actively monitor validators and their performance.',
      'Staking dashboard provides a range of metrics to help you unserstand how a validator is performing.',
    ],
    icon: infoJson,
  },
];
