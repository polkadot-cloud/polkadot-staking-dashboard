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
import Overview from './pages/Overview';
import Stake from './pages/Stake';
import Pools from './pages/Pools';
import Browse from './pages/Validators';
import Favourites from './pages/Favourites';
import Payouts from './pages/Payouts';
import Projects from './pages/explore/Projects';
import Feedback from './pages/explore/Feedback';
import { URI_PREFIX } from './constants';

export const PAGE_CATEGORIES = [
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

export const PAGES_CONFIG = [
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

export const ASSISTANT_CONFIG = [
  {
    key: 'overview',
    definitions: [
      {
        title: 'Supply Staked',
        description: [
          'The current cumulative supply of DOT being staked globally.',
          'The percentage of staked DOT is relative to the total supply of DOT.',
        ],
      },
      {
        title: 'Nominators',
        description: [
          'Nominators are accounts who are staking in the network, regardless of whether they are active or earning rewards.',
          'In order to stake DOT, you must be a nominator.',
        ],
      },
      {
        title: 'Active Nominators',
        description: [
          'The amount of nominators in the network who are actively earning rewards.',
        ],
      },
      {
        title: 'Your Balances',
        description: [
          'Your balance is a total of the total amount you have staked, and the total amount you have bonded in a Pool.',
          'Unlike your staked balance, your bonded pool balance is held and locked in the pool itself.',
        ],
      },
      {
        title: 'Announcements',
        description: [
          'Real time network statistics that may affect your staking positions.',
          'Keep up to date on the state of the network from your Overview.',
        ],
      },
    ],
    external: [
      // {
      //   label: 'Tutorials',
      //   title: 'What is Polkadot Staking?',
      //   subtitle: '',
      //   url: 'https://polkadot.network/'
      // },
    ],
  },
  {
    key: 'stake',
    definitions: [
      {
        title: 'Staking Status',
        description: [
          'The current state of your staking position.',
          'Whether you receive rewards depends on whether you have active nominations in the current era, and whether you are above their over-subscribed threshold.',
          'Your staking status provides you this information at a glance.',
        ],
      },
      {
        title: 'Stash and Controller Accounts',
        description: [
          'The Stash and Controller are simply Polkadot accounts that manage your staking activity.',
          "Your Stash account is the account used to hold your staked funds, whereas the Controller account is used to carry out Staking actions on the Stash account's behalf.",
          'When you switch accounts in this app, you are actually switching your Stash account. Your Controller account is then automatically fetched for you.',
          'This app assumes you have both Stash and Controller accounts imported. If you do not, you will not be able to use all app functions.',
          'You can assign a different Controller account on the Stake page.',
        ],
      },
      {
        title: 'Bonding',
        description: [
          'Bonding funds is the process of "locking" (or staking) DOT. Bonded DOT will then be automatically allocated to one or more of your nominated validators.',
          'The minimum active bond statistic is the minimum DOT being bonded by a nominator for the current era.',
        ],
      },
      {
        title: 'Active Bond Threshold',
        description: [
          'The amount of DOT needed to be actively nominating in an era. ',
          'Being above this metric simply guarantees that you will be present in the active nominator set for the era. This amount still does not guarantee rewards, as your active nominations may still be over-subscribed.',
          'Only the top 256 nominators are rewarded per validator. Ensuring your active bond is above this threshold will increase your chances of rewards.',
          'You can keep track of these metrics from the dashboard and amend your staking position if necessary, whether increasing your bonded DOT or changing your nominations.',
        ],
      },
      {
        title: 'Reward Destination',
        description: [
          'Your reward destination is where your rewards are sent to.',
          'Rewards can be automatically bonded on top of your current bond, or they can be sent to your stash, controller, or an external account of your choosing.',
        ],
      },
      {
        title: 'Nominating',
        description: [
          'Nominating is the process of selecting validators you wish to stake your DOT to. You can choose to nominate up to 16 validators for each of your accounts.',
          'Once you have nominated your selected validators, they become your nominations.',
        ],
      },
      {
        title: 'Nominations',
        description: [
          'Your nominations are the validators you have chosen to nominate. You can nominate up to 16 validators.',
          'Your bonded funds are automatically distributed to nominations that are active in the staking era.',
          'As long as at least one of your nominations is actively validating in a session, your funds will be staked with that validator and you will receive rewards.',
        ],
      },
    ],
    external: [],
  },
  {
    key: 'pools',
    definitions: [
      {
        title: 'Nomination Pools',
        description: [
          'Nomination pools allow users to contribute DOT and earn staking rewards.',
          'Unlike nominating, staking using pools requires a small amount of DOT, and the pool manages nominees on your behalf.',
        ],
      },
      {
        title: 'Active Pools',
        description: ['The current amount of active nomination pools.'],
      },
      {
        title: 'Minimum Join Bond',
        description: [
          'The minimum amount of DOT needed to bond in order to join a pool.',
        ],
      },
      {
        title: 'Minimum Create Bond',
        description: [
          'The minimum amount of DOT needed to bond for a creator  of a pool.',
        ],
      },
      {
        title: 'Pool Status',
        description: [
          'Your current pool status, summarising whether your account is actively in a pool and generating rewards.',
        ],
      },
      {
        title: 'Bonded in Pool',
        description: ['The amount of DOT currently bonded in a pool.'],
      },
      {
        title: 'Pool Rewards',
        description: [
          'The amount of rewards in DOT generated by being an active participant in a pool.',
          'Users are required to claim their pool rewards in order to receive them. Pool rewards can be bonded back into the pool, or sent to your account as free DOT.',
        ],
      },
      {
        title: 'Joined Pool',
        description: [
          'The currently joined pool. Only one pool can be joined per account.',
        ],
      },
    ],
    external: [],
  },
  {
    key: 'validators',
    definitions: [
      {
        title: 'Validator',
        description: [
          'An entity that validates blocks for the Polkadot Relay Chain. Validators play a key role in Polkadot to secure the network and produce blocks.',
          'As a nominator, you choose which validators you wish to back, and receive rewards for doing so.',
        ],
      },
      {
        title: 'Active Validator',
        description: [
          "A validator that is actively validating blocks. Rewards are accumulated based on the validator's activity.",
          'A new set of validators are chosen for each era, so there is no guarantee the same validator will be active in subsequent eras.',
          'Polkadot allows a nominator to nominate up to 16 validators, maximising your chances of nominating an active validator in each era.',
        ],
      },
      {
        title: 'Era',
        description: [
          'At the end of each era, validators are rewarded DOT based on how many era points they accumulated in that era. This DOT reward is then distributed amongst the nominators of the validator via a payout.',
          '1 era is currently 24 hours in Polkadot.',
        ],
      },
      {
        title: 'Epoch',
        description: [
          'An epoch is another name for a session in Polkadot. A different set of validators are selected to validate blocks at the beginning of every epoch.',
          '1 epoch is currently 4 hours in Polkadot.',
        ],
      },
      {
        title: 'Era Points',
        description: [
          "Era Points are accumulated by validators during each era, and depend on a validator's performance.",
          'As a staker, you do not need to worry about Era Points. In general, better performing validators produce more Era Points, which in-turn lead to higher staking rewards.',
        ],
      },
      {
        title: 'Minimum Nomination Bond',
        description: [
          'The minimum amount you need bonded in order to nominate.',
        ],
      },
      {
        title: 'Commission',
        description: [
          'Validators can take a percentage of the rewards they earn. This chunk is called their commission.',
          'Nominating validators with low commissions mean you will receive a larger share of the rewards they generate.',
          'Many validators will have a commission rate of 100%, meaning you will receive no rewards by nominating these validators.',
          'Examples of such validators include those operating on behalf of exchanges, where nominating and reward distribution is done centrally on the exchange in question.',
          'A validator can update their commission rates as and when they please, and such changes will have an impact on your profitability. Be sure to monitor your nominations on this dashboard to keep updated on their commission rates.',
        ],
      },
      {
        title: 'Over Subscribed',
        description: [
          'Only the top 256 nominators for each validator are rewarded in Polkadot. When this number is surpassed, this validator is considered over subscribed.',
        ],
      },
      {
        title: 'Blocked Nominations',
        description: [
          'When a validator has blocked nominations, nominators are unable to nominate them.',
        ],
      },
    ],
    external: [],
  },
  {
    key: 'payouts',
    definitions: [
      {
        title: 'Payout',
        description: [
          'Payouts are staking rewards on Polkadot. They depend on how many "Era Points" your nominated validators accrue over time. Rewards are determined at the end of every Era (24 hour periods).',
          'To receive staking rewards, a Payout needs to be requested. Any nominator backing the validator in question can request a Payout.',
          'One payout request triggers the reward payout for every nominator.',
        ],
      },
      {
        title: 'Last Era Payout',
        description: [
          'The total amount of DOT paid out for the last active era.',
          'Payouts are distributed evenly amongst the active validators for that era, and are then further distributed to the active nominators that took part in that era.',
          'The payout amounts received depend on how much DOT the nominators, and validators themselves, had bonded for that era.',
        ],
      },
      {
        title: 'Payout History',
        description: [
          'Historical records of payouts made for being an active nominator.',
          'Requesting payouts is a manual process, so you may receive payouts for multiple eras in quick succession or in a sporadic fashion. Your payout graphs may therefore have multiple payouts occur on the same day, or have days where there were no payouts.',
          'This does not mean that you were not nominating or generating rewards in that period - only that the payout for that period was not yet made.',
        ],
      },
    ],
    external: [],
  },
  {
    key: 'community',
    definitions: [],
    external: [],
  },
];

export const pageTitleFromUri = (pathname: string) => {
  for (const page of PAGES_CONFIG) {
    if (page.uri === pathname) return page.title;
  }
  return '';
};

export default PAGES_CONFIG;
