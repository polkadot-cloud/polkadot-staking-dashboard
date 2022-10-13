// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

// TODO: re-introduce type
export const HELP_CONFIG: any = [
  {
    key: 'overview',
    definitions: [
      {
        key: 'Supply Staked',
        localeKey: 'overview.definitions.supply_staked',
      },
      {
        key: 'Total Nominators',
        localeKey: 'overview.definitions.total_nominators',
      },
      {
        key: 'Active Nominators',
        localeKey: 'overview.definitions.active_nominators',
      },
      {
        key: '"Your Balance',
        localeKey: 'overview.definitions.your_balance',
      },
      {
        key: 'Reserve Balance',
        localeKey: 'overview.definitions.reserve_balance',
      },
      {
        key: 'Network Stats',
        localeKey: 'overview.definitions.network_stats',
      },
      {
        key: 'Inflation',
        localeKey: 'overview.definitions.inflation',
      },
      {
        key: 'Historical Rewards Rate',
        localeKey: 'overview.definitions.historical_rewards_rate',
      },
      {
        key: 'Ideal Staked',
        localeKey: 'overview.definitions.ideal_staked',
      },
    ],
    external: [
      {
        localeKey: 'overview.external.connect_your_accounts',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182121-how-to-use-the-staking-dashboard-connecting-your-account',
        website: 'polkadot.network',
      },
      {
        localeKey: 'overview.external.how_to_use',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
      {
        localeKey: 'overview.external.stake_dot',
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
        localeKey: 'nominate.definitions.nomination_status',
      },
      {
        key: 'Stash and Controller Accounts',
        localeKey: 'nominate.definitions.stash_and_controller_accounts',
      },
      {
        key: 'Bonding',
        localeKey: 'nominate.definitions.bonding',
      },
      {
        key: 'Active Bond Threshold',
        localeKey: 'nominate.definitions.active_bond_threshold',
      },
      {
        key: 'Reward Destination',
        localeKey: 'nominate.definitions.reward_destination',
      },
      {
        key: 'Nominating',
        localeKey: 'nominate.definitions.nominating',
      },
      {
        key: 'Nominations',
        localeKey: 'nominate.definitions.nominations',
      },
      {
        key: 'Inactive Nominations',
        localeKey: 'nominate.definitions.inactive_nominations',
      },
    ],
    external: [
      {
        localeKey: 'nominate.external.change_destination',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182220-how-to-use-the-staking-dashboard-changing-reward-destination',
        website: 'polkadot.network',
      },
      {
        localeKey: 'nominate.external.bond_more',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182207-how-to-use-the-staking-dashboard-bond-more-tokens-to-your-existing-stake',
        website: 'polkadot.network',
      },
      {
        localeKey: 'nominate.external.unbonding_tokens',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182201-how-to-use-the-staking-dashboard-unbonding-your-tokens',
        website: 'polkadot.network',
      },
      {
        localeKey: 'nominate.external.rebonding',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182221-how-to-use-the-staking-dashboard-rebonding',
        website: 'polkadot.network',
      },
      {
        localeKey: 'nominate.external.change_account',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182218-how-to-use-the-staking-dashboard-changing-your-controller-account',
        website: 'polkadot.network',
      },
      {
        localeKey: 'nominate.external.change_nominations',
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
        localeKey: 'pools.definitions.nomination_pools',
      },
      {
        key: 'Active Pools',
        localeKey: 'pools.definitions.active_pools',
      },
      {
        key: 'Minimum Join Bond',
        localeKey: 'pools.definitions.minimum_join_bond',
      },
      {
        key: 'Minimum Create Bond',
        localeKey: 'pools.definitions.minimum_create_bond',
      },
      {
        key: 'Pool Membership',
        localeKey: 'pools.definitions.pool_membership',
      },
      {
        key: 'Bonded in Pool',
        localeKey: 'pools.definitions.bonded_in_pool',
      },
      {
        key: 'Pool Rewards',
        localeKey: 'pools.definitions.pool_rewards',
      },
      {
        key: 'Pool Roles',
        localeKey: 'pools.definitions.pool_roles',
      },
    ],
    external: [
      {
        localeKey: 'pools.external.create_pools',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182388-how-to-use-the-staking-dashboard-creating-nomination-pools',
        website: 'polkadot.network',
      },
      {
        localeKey: 'pools.external.claim_rewards',
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
        localeKey: 'validators.definitions.validator',
      },
      {
        key: 'Active Validator',
        localeKey: 'validators.definitions.active_validator',
      },
      {
        key: 'Average Commission',
        localeKey: 'validators.definitions.average_commission',
      },
      {
        key: 'Era',
        localeKey: 'validators.definitions.era',
      },
      {
        key: 'Epoch',
        localeKey: 'validators.definitions.epoch',
      },
      {
        key: 'Era Points',
        localeKey: 'validators.definitions.era_eoints',
      },
      {
        key: 'Self Stake',
        localeKey: 'validators.definitions.self_stake',
      },
      {
        key: 'Nominator Stake',
        localeKey: 'validators.definitions.nominator_stake',
      },
      {
        key: 'Minimum Nomination Bond',
        localeKey: 'validators.definitions.minimum_nomination_bond',
      },
      {
        key: 'Commission',
        localeKey: 'validators.definitions.commission',
      },
      {
        key: 'Over Subscribed',
        localeKey: 'validators.definitions.over_subscribed',
      },
      {
        key: 'Blocked Nominations',
        localeKey: 'validators.definitions.blocked_nominations',
      },
    ],
    external: [
      {
        localeKey: 'validators.external.choose_validators',
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
        localeKey: 'payouts.definitions.payout',
      },
      {
        key: 'Last Era Payout',
        localeKey: 'payouts.definitions.last_era_payout',
      },
      {
        key: 'Payout History',
        localeKey: 'payouts.definitions.payout_history',
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
