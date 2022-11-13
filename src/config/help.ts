// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HelpItemLocales } from 'contexts/Help/types';

export const HELP_CONFIG: HelpItemLocales = [
  {
    key: 'overview',
    definitions: [
      ['Dashboard Tips', 'dashboard_tips'],
      ['Supply Staked', 'supply_staked'],
      ['Total Nominators', 'total_nominators'],
      ['Active Nominators', 'active_nominators'],
      ['Your Balance', 'your_balance'],
      ['Reserve Balance', 'reserve_balance'],
      ['Network Stats', 'network_stats'],
      ['Inflation', 'inflation'],
      ['Historical Rewards Rate', 'historical_rewards_rate'],
      ['Ideal Staked', 'ideal_staked'],
    ],
    external: [
      {
        localeKey: 'connect_your_accounts',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182121-how-to-use-the-staking-dashboard-connecting-your-account',
        website: 'polkadot.network',
      },
      {
        localeKey: 'how_to_use',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
      {
        localeKey: 'stake_dot',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'nominate',
    definitions: [
      ['Nomination Status', 'nomination_status'],
      ['Stash and Controller Accounts', 'stash_and_controller_accounts'],
      ['Controller Account Eligibility', 'controller_account_eligibility'],
      ['Bonding', 'bonding'],
      ['Active Bond Threshold', 'active_bond_threshold'],
      ['Reward Destination', 'reward_destination'],
      ['Nominating', 'nominating'],
      ['Nominations', 'nominations'],
      ['Inactive Nominations', 'inactive_nominations'],
    ],
    external: [
      {
        localeKey: 'change_destination',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182220-how-to-use-the-staking-dashboard-changing-reward-destination',
        website: 'polkadot.network',
      },
      {
        localeKey: 'bond_more',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182207-how-to-use-the-staking-dashboard-bond-more-tokens-to-your-existing-stake',
        website: 'polkadot.network',
      },
      {
        localeKey: 'unbonding_tokens',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182201-how-to-use-the-staking-dashboard-unbonding-your-tokens',
        website: 'polkadot.network',
      },
      {
        localeKey: 'rebonding',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182221-how-to-use-the-staking-dashboard-rebonding',
        website: 'polkadot.network',
      },
      {
        localeKey: 'change_account',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182218-how-to-use-the-staking-dashboard-changing-your-controller-account',
        website: 'polkadot.network',
      },
      {
        localeKey: 'change_nominations',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182518-how-to-use-the-staking-dashboard-changing-your-nominations',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'pools',
    definitions: [
      ['Nomination Pools', 'nomination_pools'],
      ['Active Pools', 'active_pools'],
      ['Minimum Join Bond', 'minimum_join_bond'],
      ['Minimum Create Bond', 'minimum_create_bond'],
      ['Pool Membership', 'pool_membership'],
      ['Bonded in Pool', 'bonded_in_pool'],
      ['Pool Rewards', 'pool_rewards'],
      ['Pool Roles', 'pool_roles'],
    ],
    external: [
      {
        localeKey: 'create_pools',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182388-how-to-use-the-staking-dashboard-creating-nomination-pools',
        website: 'polkadot.network',
      },
      {
        localeKey: 'claim_rewards',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182399-how-to-use-staking-dashboard-claiming-nomination-pool-rewards',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'validators',
    definitions: [
      ['Validator', 'validator'],
      ['Active Validator', 'active_validator'],
      ['Average Commission', 'average_commission'],
      ['Era', 'era'],
      ['Epoch', 'epoch'],
      ['Era Points', 'era_eoints'],
      ['Self Stake', 'self_stake'],
      ['Nominator Stake', 'nominator_stake'],
      ['Commission', 'commission'],
      ['Over Subscribed', 'over_subscribed'],
      ['Blocked Nominations', 'blocked_nominations'],
    ],
    external: [
      {
        localeKey: 'choose_validators',
        url: 'https://support.polkadot.network/support/solutions/articles/65000150130-how-do-i-know-which-validators-to-choose-',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'payouts',
    definitions: [
      ['Payout', 'payout'],
      ['Last Era Payout', 'last_era_payout'],
      ['Payout History', 'payout_history'],
    ],
    external: [],
  },
  {
    key: 'community',
    definitions: [],
    external: [],
  },
];
