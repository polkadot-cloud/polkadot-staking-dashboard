// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HelpItemLocales } from 'contexts/Help/types';

export const HELP_CONFIG: HelpItemLocales = [
  {
    key: 'overview',
    definitions: [
      {
        key: 'Dashboard Tips',
        localeKey: 'dashboard_tips',
      },
      {
        key: 'Supply Staked',
        localeKey: 'supply_staked',
      },
      {
        key: 'Total Nominators',
        localeKey: 'total_nominators',
      },
      {
        key: 'Active Nominators',
        localeKey: 'active_nominators',
      },
      {
        key: '"Your Balance',
        localeKey: 'your_balance',
      },
      {
        key: 'Reserve Balance',
        localeKey: 'reserve_balance',
      },
      {
        key: 'Network Stats',
        localeKey: 'network_stats',
      },
      {
        key: 'Inflation',
        localeKey: 'inflation',
      },
      {
        key: 'Historical Rewards Rate',
        localeKey: 'historical_rewards_rate',
      },
      {
        key: 'Ideal Staked',
        localeKey: 'ideal_staked',
      },
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
      {
        key: 'Nomination Status',
        localeKey: 'nomination_status',
      },
      {
        key: 'Stash and Controller Accounts',
        localeKey: 'stash_and_controller_accounts',
      },
      {
        key: 'Controller Account Eligibility',
        localeKey: 'controller_account_eligibility',
      },
      {
        key: 'Bonding',
        localeKey: 'bonding',
      },
      {
        key: 'Active Bond Threshold',
        localeKey: 'active_bond_threshold',
      },
      {
        key: 'Reward Destination',
        localeKey: 'reward_destination',
      },
      {
        key: 'Nominating',
        localeKey: 'nominating',
      },
      {
        key: 'Nominations',
        localeKey: 'nominations',
      },
      {
        key: 'Inactive Nominations',
        localeKey: 'inactive_nominations',
      },
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
      {
        key: 'Nomination Pools',
        localeKey: 'nomination_pools',
      },
      {
        key: 'Active Pools',
        localeKey: 'active_pools',
      },
      {
        key: 'Minimum Join Bond',
        localeKey: 'minimum_join_bond',
      },
      {
        key: 'Minimum Create Bond',
        localeKey: 'minimum_create_bond',
      },
      {
        key: 'Pool Membership',
        localeKey: 'pool_membership',
      },
      {
        key: 'Bonded in Pool',
        localeKey: 'bonded_in_pool',
      },
      {
        key: 'Pool Rewards',
        localeKey: 'pool_rewards',
      },
      {
        key: 'Pool Roles',
        localeKey: 'pool_roles',
      },
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
      {
        key: 'Validator',
        localeKey: 'validator',
      },
      {
        key: 'Active Validator',
        localeKey: 'active_validator',
      },
      {
        key: 'Average Commission',
        localeKey: 'average_commission',
      },
      {
        key: 'Era',
        localeKey: 'era',
      },
      {
        key: 'Epoch',
        localeKey: 'epoch',
      },
      {
        key: 'Era Points',
        localeKey: 'era_eoints',
      },
      {
        key: 'Self Stake',
        localeKey: 'self_stake',
      },
      {
        key: 'Nominator Stake',
        localeKey: 'nominator_stake',
      },
      {
        key: 'Commission',
        localeKey: 'commission',
      },
      {
        key: 'Over Subscribed',
        localeKey: 'over_subscribed',
      },
      {
        key: 'Blocked Nominations',
        localeKey: 'blocked_nominations',
      },
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
      {
        key: 'Payout',
        localeKey: 'payout',
      },
      {
        key: 'Last Era Payout',
        localeKey: 'last_era_payout',
      },
      {
        key: 'Payout History',
        localeKey: 'payout_history',
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
