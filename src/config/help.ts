// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HelpContentRaw } from 'contexts/Help/types';

export const HELP_CONFIG: HelpContentRaw = [
  {
    key: 'overview',
    definitions: [
      // TODO: migrate to just keys and fetch content from i18n
      // {
      //   helpKey: 'Supply Staked',
      //   localeKey: 'overview.definitions.supply_staked',
      // },
      {
        title: 'Supply Staked',
        description: [
          'The current cumulative supply of {NETWORK_UNIT} being staked globally.',
          'The percentage of staked {NETWORK_UNIT} is relative to the total supply of {NETWORK_UNIT}.',
        ],
      },
      {
        title: 'Total Nominators',
        description: [
          'Accounts who are staking in the network, regardless of whether they are active or inactive in the current session.',
          'In order to stake {NETWORK_UNIT}, you must be a nominator.',
        ],
      },
      {
        title: 'Active Nominators',
        description: [
          'Nominators who are active in the current session.',
          'Being an active nominator does not guarantee rewards, as your nominees may be oversubscribed.',
        ],
      },
      {
        title: 'Your Balance',
        description: [
          'Your balance represents the total {NETWORK_UNIT} you have available in addition to your total staked amount, that includes the amount you have bonded in a Pool.',
          'Unlike your staked balance, your bonded pool balance is held and locked in the pool itself.',
        ],
      },
      {
        title: 'Reserve Balance',
        description: [
          'In {NETWORK_NAME}, you must have a balance above a certain amount for your account to exist on-chain. This amount is called your "existential deposit".',
          'Staking dashboard ensures that this amount of {NETWORK_UNIT} is never touched.',
        ],
      },
      {
        title: 'Network Stats',
        description: [
          'Real time network statistics that may affect your staking positions.',
          'Keep up to date on the state of the network from your Overview.',
        ],
      },
      {
        title: 'Inflation',
        description: [
          'DOT is inflationary; there is no maximum number of DOT.',
          'Inflation is designed to be approximately 10% annually, with validator rewards being a function of the amount staked and the remainder going to treasury.',
        ],
      },
      {
        title: 'Historical Rewards Rate',
        description: [
          'An estimated annual yield based on the {NETWORK_NAME} reward distribution model.',
        ],
      },
      {
        title: 'Ideal Staked',
        description: [
          'The percentage of staked total supply in ideal network conditions.',
        ],
      },
    ],
    external: [
      {
        title: 'How to Connect Your Accounts',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182121-how-to-use-the-staking-dashboard-connecting-your-account',
        website: 'polkadot.network',
      },
      {
        title: 'How to Use the Staking Dashboard: Overview',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
      {
        title: 'Staking your DOT',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'nominate',
    definitions: [
      {
        title: 'Nomination Status',
        description: [
          'The status of your nominations at a glance.',
          'A set of nominations will be inactive when none of those nominees are participating in the current validator set - the set of validators currently elected to validate the network.',
          'When at least one of your nominees are active, this nomination status will display as actively nominating - but this still does not guarantee rewards.',
          'The top {MAX_NOMINATOR_REWARDED_PER_VALIDATOR} nominators of each active validator receive rewards on {NETWORK_NAME}. So if a nominee is active and over-subscribed, you must be a part of the  {MAX_NOMINATOR_REWARDED_PER_VALIDATOR} highest bonded nominators to receive rewards.',
          'If an active nominee is not over-subscribed, you will receive rewards.',
        ],
      },
      {
        title: 'Stash and Controller Accounts',
        description: [
          'The Stash and Controller are simply {NETWORK_NAME} accounts that manage your staking activity.',
          "Your Stash account is the account used to hold your staked funds, whereas the Controller account is used to carry out Staking actions on the Stash account's behalf.",
          'When you switch accounts in this app, you are actually switching your Stash account. Your Controller account is then automatically fetched for you.',
          'This app assumes you have both Stash and Controller accounts imported. If you do not, you will not be able to use all app functions.',
          'You can assign a different Controller account on the Stake page.',
        ],
      },
      {
        title: 'Bonding',
        description: [
          'Bonding funds is the process of "locking" (or staking) {NETWORK_UNIT}. Bonded {NETWORK_UNIT} will then be automatically allocated to one or more of your nominated validators.',
          'The minimum active bond statistic is the minimum {NETWORK_UNIT} being bonded by a nominator for the current era.',
        ],
      },
      {
        title: 'Active Bond Threshold',
        description: [
          'The amount of {NETWORK_UNIT} needed to be actively nominating in an era. ',
          'Being above this metric simply guarantees that you will be present in the active nominator set for the era. This amount still does not guarantee rewards, as your active nominations may still be over-subscribed.',
          'Only the top {MAX_NOMINATOR_REWARDED_PER_VALIDATOR} nominators are rewarded per validator in {NETWORK_NAME}. Ensuring your active bond is above this threshold will increase your chances of rewards.',
          'You can keep track of these metrics from the dashboard and amend your staking position if necessary, whether increasing your bonded {NETWORK_UNIT} or changing your nominations.',
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
          'Nominating is the process of selecting validators you wish to stake your {NETWORK_UNIT} to. You can choose to nominate up to 16 validators for each of your accounts.',
          'Once you have nominated your selected validators, they become your nominations.',
        ],
      },
      {
        title: 'Nominations',
        description: [
          'Nominations are the validators a staker chooses to nominate. You can nominate up to {MAX_NOMINATIONS} validators on {NETWORK_NAME}.',
          "Once nominations have been submitted, the staker's bonded funds are automatically distributed to nominees that are active in the curernt era.",
          'As long as at least one of your nominations is actively validating in a session, your funds will be backing that validator.',
        ],
      },
      {
        title: 'Inactive Nominations',
        description: [
          'Nominations that are in the active validator set for the current era, but your bonded funds have not been assigned to these nominations.',
        ],
      },
    ],
    external: [
      {
        title: 'Changing Your Reward Destination',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182220-how-to-use-the-staking-dashboard-changing-reward-destination',
        website: 'polkadot.network',
      },
      {
        title: 'Bond More Tokens to Your Existing Stake',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182207-how-to-use-the-staking-dashboard-bond-more-tokens-to-your-existing-stake',
        website: 'polkadot.network',
      },
      {
        title: 'Unbonding Your Tokens',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182201-how-to-use-the-staking-dashboard-unbonding-your-tokens',
        website: 'polkadot.network',
      },
      {
        title: 'Rebonding',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182221-how-to-use-the-staking-dashboard-rebonding',
        website: 'polkadot.network',
      },
      {
        title: 'Changing your Controller Account',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182218-how-to-use-the-staking-dashboard-changing-your-controller-account',
        website: 'polkadot.network',
      },
      {
        title: 'Changing Your Nominations',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182518-how-to-use-the-staking-dashboard-changing-your-nominations',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'pools',
    definitions: [
      {
        title: 'Nomination Pools',
        description: [
          'Nomination pools allow users to contribute {NETWORK_UNIT} and earn staking rewards.',
          'Unlike nominating, staking using pools requires a small amount of {NETWORK_UNIT}, and the pool manages nominees on your behalf.',
        ],
      },
      {
        title: 'Active Pools',
        description: [
          'The current amount of active nomination pools on {NETWORK_NAME}.',
        ],
      },
      {
        title: 'Minimum Join Bond',
        description: [
          'The minimum amount of {NETWORK_UNIT} needed to bond in order to join a pool.',
          'This amount is different from the bond needed to create a pool.',
        ],
      },
      {
        title: 'Minimum Create Bond',
        description: [
          'The minimum amount of {NETWORK_UNIT} needed to bond in order to create a pool.',
          'Creating a pool requires a larger deposit than that of joining a pool.',
        ],
      },
      {
        title: 'Pool Membership',
        description: [
          'Your pool membership status reflects whether you are a member of a pool.',
          'Pool memberships can either be that of a pool member or a pool owner.',
          'Currently on {NETWORK_NAME}, accounts can only join one pool at a time. If you wish to join another pool, you must leave your current pool first.',
          'To leave a pool, you simply need to unbond and withdraw all your bonded {NETWORK_UNIT}. Staking dashboard provides a dedicated Leave button to unbond from a pool.',
        ],
      },
      {
        title: 'Bonded in Pool',
        description: [
          'The amount of {NETWORK_UNIT} currently bonded in a pool.',
          "Unlike solo staking, where your bonded funds remain in your account but become locked, the {NETWORK_UNIT} you bond to a pool is transferred to the pool's stash account. Nonetheless, pool members still have access to unbond their funds at any time.",
        ],
      },
      {
        title: 'Pool Rewards',
        description: [
          'The amount of {NETWORK_UNIT} generated by being an active participant in a pool.',
          'Pool members are required to claim their rewards in order to have them transferred to their balance.',
          'Users have 2 choices for claiming rewards. They can be bonded back into the pool, that will increase your share of the pool and accumulate further rewards. Rewards can also be withdrawn from the pool to your account as free {NETWORK_UNIT}.',
        ],
      },
      {
        title: 'Pool Roles',
        description: [
          'A pool consists of 4 roles, each of which having different responsibilities in managing the running of the pool.',
          'Root: Can change the nominator, state-toggler, or itself. Further, it can perform any of the actions the nominator or state-toggler can.',
          'Depositor: Creates the pool and is the initial member. The depositor can only leave the pool once all other members have left. Once they leave by withdrawing, the pool is fully removed from the system.',
          'Nominator: Can select the validators the pool nominates.',
          "State-Toggler: Can change the pool's state and kick (permissionlessly unbond/withdraw) members if the pool is blocked.",
        ],
      },
    ],
    external: [
      {
        title: 'Creating Nomination Pools',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182388-how-to-use-the-staking-dashboard-creating-nomination-pools',
        website: 'polkadot.network',
      },
      {
        title: 'Claiming Nomination Pool Rewards',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182399-how-to-use-staking-dashboard-claiming-nomination-pool-rewards',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'validators',
    definitions: [
      {
        title: 'Validator',
        description: [
          'An entity that validates blocks for the {NETWORK_NAME} Relay Chain. Validators play a key role in {NETWORK_NAME} to secure the network and produce blocks.',
          'As a nominator, you choose which validators you wish to back, and receive rewards for doing so.',
        ],
      },
      {
        title: 'Active Validator',
        description: [
          "A validator that is actively validating blocks. Rewards are accumulated based on the validator's activity.",
          'A new set of validators are chosen for each era, so there is no guarantee the same validator will be active in subsequent eras.',
          '{NETWORK_NAME} allows a nominator to nominate up to 16 validators, maximising your chances of nominating an active validator in each era.',
        ],
      },
      {
        title: 'Average Commission',
        description: [
          'The average validator commission rate on {NETWORK_NAME}.',
          'This metric excludes validators who host a 100% commission, as these nodes usually block nominations are are run for the purposes of staking on central exchange platforms.',
        ],
      },
      {
        title: 'Era',
        description: [
          'At the end of each era, validators are rewarded {NETWORK_UNIT} based on how many era points they accumulated in that era. This {NETWORK_UNIT} reward is then distributed amongst the nominators of the validator via a payout.',
          '1 era is currently 24 hours in Polkadot.',
        ],
      },
      {
        title: 'Epoch',
        description: [
          'An epoch is another name for a session in {NETWORK_NAME}. A different set of validators are selected to validate blocks at the beginning of every epoch.',
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
        title: 'Self Stake',
        description: [
          'The amount of {NETWORK_UNIT} the validator has bonded themself.',
          'This value is added to the amount of {NETWORK_UNIT} bonded by nominators to form the total stake of the validator.',
        ],
      },
      {
        title: 'Nominator Stake',
        description: [
          'The amount of {NETWORK_UNIT} backing the validator from its nominators.',
          "This value is added to the validator's self stake to form the total stake of the validator.",
          'Note that this value changes every era as the bonded funds of nominators are re-distributed to the active validators of that session.',
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
          'Only the top {MAX_NOMINATOR_REWARDED_PER_VALIDATOR} nominators for each validator are rewarded in {NETWORK_NAME}. When this number is surpassed, this validator is considered over subscribed.',
        ],
      },
      {
        title: 'Blocked Nominations',
        description: [
          'When a validator has blocked nominations, nominators are unable to nominate them.',
        ],
      },
    ],
    external: [
      {
        title: 'How do I Know Which Validators to Choose?',
        url: 'https://support.polkadot.network/support/solutions/articles/65000150130-how-do-i-know-which-validators-to-choose-',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'payouts',
    definitions: [
      {
        title: 'Payout',
        description: [
          'Payouts are staking rewards on {NETWORK_NAME}. They depend on how many "Era Points" your nominated validators accrue over time. Rewards are determined at the end of every Era (24 hour periods).',
          'To receive staking rewards, a Payout needs to be requested. Any nominator backing the validator in question can request a Payout.',
          'One payout request triggers the reward payout for every nominator.',
        ],
      },
      {
        title: 'Last Era Payout',
        description: [
          'The total amount of {NETWORK_UNIT} paid out for the last active era.',
          'Payouts are distributed evenly amongst the active validators for that era, and are then further distributed to the active nominators that took part in that era.',
          'The payout amounts received depend on how much {NETWORK_UNIT} the nominators, and validators themselves, had bonded for that era.',
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
