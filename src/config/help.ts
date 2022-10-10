// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const HELP_CONFIG: any = [
  {
    key: 'overview',
    definitions: [
      {
        helpKey: 'Supply Staked',
        localeKey: 'overview.definitions.supply_staked',
      },
      {
        helpKey: 'Total Nominators',
        localeKey: 'overview.definitions.total_nominators',
      },
      {
        helpKey: 'Active Nominators',
        localeKey: 'overview.definitions.active_nominators',
      },
      {
        helpKey: '"Your Balance',
        localeKey: 'overview.definitions.your_balance',
      },
      {
        helpKey: 'Reserve Balance',
        localeKey: 'overview.definitions.reserve_balance',
      },
      {
        helpKey: 'Network Stats',
        localeKey: 'overview.definitions.network_stats',
      },
      {
        helpKey: 'Inflation',
        localeKey: 'overview.definitions.inflation',
      },
      {
        helpKey: 'Historical Rewards Rate',
        localeKey: 'overview.definitions.historical_rewards_rate',
      },
      {
        helpKey: 'Ideal Staked',
        localeKey: 'overview.definitions.ideal_staked',
      },
    ],
    external: [
      {
        title: 'overview.external.connect_your_accounts',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182121-how-to-use-the-staking-dashboard-connecting-your-account',
        website: 'polkadot.network',
      },
      {
        title: 'overview.external.how_to_use',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
      {
        title: 'overview.external.stake_dot',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'nominate',
    definitions: [
      {
        helpKey: 'Nomination Status',
        localeKey: 'nominate.definitions.nomination_status',
      },
      {
        helpKey: 'Stash and Controller Accounts',
        localeKey: 'nominate.definitions.stash_and_controller_accounts',
      },
      {
        helpKey: 'Bonding',
        localeKey: 'nominate.definitions.bonding',
      },
      {
        helpKey: 'Active Bond Threshold',
        localeKey: 'nominate.definitions.active_bond_threshold',
      },
      {
        helpKey: 'Reward Destination',
        localeKey: 'nominate.definitions.reward_destination',
      },
      {
        helpKey: 'Nominating',
        localeKey: 'nominate.definitions.nominating',
      },
      {
        helpKey: 'Nominations',
        localeKey: 'nominate.definitions.nominations',
      },
      {
        helpKey: 'Inactive Nominations',
        localeKey: 'nominate.definitions.inactive_nominations',
      },
    ],
    external: [
      {
        title: 'nominate.external.chang_destination',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182220-how-to-use-the-staking-dashboard-changing-reward-destination',
        website: 'polkadot.network',
      },
      {
        title: 'nominate.external.bond_more',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182207-how-to-use-the-staking-dashboard-bond-more-tokens-to-your-existing-stake',
        website: 'polkadot.network',
      },
      {
        title: 'nominate.external.unbonding_tokens',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182201-how-to-use-the-staking-dashboard-unbonding-your-tokens',
        website: 'polkadot.network',
      },
      {
        title: 'nominate.external.rebonding',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182221-how-to-use-the-staking-dashboard-rebonding',
        website: 'polkadot.network',
      },
      {
        title: 'nominate.external.change_account',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182218-how-to-use-the-staking-dashboard-changing-your-controller-account',
        website: 'polkadot.network',
      },
      {
        title: 'nominate.external.change_nominations',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182518-how-to-use-the-staking-dashboard-changing-your-nominations',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'pools',
    definitions: [
      {
        helpKey: 'Nomination Pools',
        localeKey: 'pools.definitions.nomination_pools',
      },
      {
        helpKey: 'Active Pools',
        localeKey: 'pools.definitions.active_pools',
      },
      {
        helpKey: 'Minimum Join Bond',
        localeKey: 'pools.definitions.minimum_join_bond',
      },
      {
        helpKey: 'Minimum Create Bond',
        localeKey: 'pools.definitions.minimum_create_bond',
      },
      {
        helpKey: 'Pool Membership',
        localeKey: 'pools.definitions.pool_membership',
      },
      {
        helpKey: 'Bonded in Pool',
        localeKey: 'pools.definitions.bonded_in_pool',
      },
      {
        helpKey: 'Pool Rewards',
        localeKey: 'pools.definitions.pool_rewards',
      },
      {
        helpKey: 'Pool Roles',
        localeKey: 'pools.definitions.pool_roles',
      },
    ],
    external: [
      {
        title: 'pools.external.create_pools',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182388-how-to-use-the-staking-dashboard-creating-nomination-pools',
        website: 'polkadot.network',
      },
      {
        title: 'pools.external.claim_rewards',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182399-how-to-use-staking-dashboard-claiming-nomination-pool-rewards',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'validators',
    definitions: [
      {
        helpKey: 'Validator',
        localeKey: 'validators.definitions.validator',
      },
      {
        helpKey: 'Active Validator',
        localeKey: 'validators.definitions.active_validator',
      },
      {
        helpKey: 'Average Commission',
        localeKey: 'validators.definitions.average_commission',
      },
      {
        helpKey: 'Era',
        localeKey: 'validators.definitions.era',
      },
      {
        helpKey: 'Epoch',
        localeKey: 'validators.definitions.epoch',
      },
      {
        helpKey: 'Era Points',
        localeKey: 'validators.definitions.era_eoints',
      },
      {
        helpKey: 'Self Stake',
        localeKey: 'validators.definitions.self_stake',
      },
      {
        helpKey: 'Nominator Stake',
        localeKey: 'validators.definitions.nominator_stake',
      },
      {
        helpKey: 'Minimum Nomination Bond',
        localeKey: 'validators.definitions.minimum_nomination_bond',
      },
      {
        helpKey: 'Commission',
        localeKey: 'validators.definitions.commission',
      },
      {
        helpKey: 'Over Subscribed',
        localeKey: 'validators.definitions.over_subscribed',
      },
      {
        helpKey: 'Blocked Nominations',
        localeKey: 'validators.definitions.blocked_nominations',
      },
    ],
    external: [
      {
        title: 'validators.external.choose_validators',
        url: 'https://support.polkadot.network/support/solutions/articles/65000150130-how-do-i-know-which-validators-to-choose-',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'payouts',
    definitions: [
      {
        helpKey: 'Payout',
        localeKey: 'payouts.definitions.payout',
      },
      {
        helpKey: 'Last Era Payout',
        localeKey: 'payouts.definitions.last_era_payout',
      },
      {
        helpKey: 'Payout History',
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
