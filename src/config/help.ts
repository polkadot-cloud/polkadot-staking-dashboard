// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const HELP_CONFIG: any = [
  {
    key: 'overview',
    definitions: [
      {
        title: 'overview.definitions.supply_staked.title',
        description: 'overview.definitions.supply_staked.description',
      },
      {
        title: 'overview.definitions.total_nominators.title',
        description: 'overview.definitions.total_nominators.description',
      },
      {
        title: 'overview.definitions.active_nominators.title',
        description: 'overview.definitions.active_nominators.description',
      },
      {
        title: 'overview.definitions.your_balance.title',
        description: 'overview.definitions.your_balance.description',
      },
      {
        title: 'overview.definitions.reserve_balance.title',
        description: 'overview.definitions.reserve_balance.description',
      },
      {
        title: 'overview.definitions.network_stats.title',
        description: 'overview.definitions.network_stats.description',
      },
      {
        title: 'overview.definitions.inflation.title',
        description: 'overview.definitions.inflation.description',
      },
      {
        title: 'overview.definitions.historical_rewards_rate.title',
        description: 'overview.definitions.historical_rewards_rate.description',
      },
      {
        title: 'overview.definitions.ideal_staked.title',
        description: 'overview.definitions.ideal_staked.description',
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
        title: 'nominate.definitions.nomination_status.title',
        description: 'nominate.definitions.nomination_status.description',
      },
      {
        title: 'nominate.definitions.stash_and_controller_accounts.title',
        description:
          'nominate.definitions.stash_and_controller_accounts.description',
      },
      {
        title: 'nominate.definitions.bonding.title',
        description: 'nominate.definitions.bonding.description',
      },
      {
        title: 'nominate.definitions.active_bond_threshold.title',
        description: 'nominate.definitions.active_bond_threshold.description',
      },
      {
        title: 'nominate.definitions.reward_destination.title',
        description: 'nominate.definitions.reward_destination.description',
      },
      {
        title: 'nominate.definitions.nominating.title',
        description: 'nominate.definitions.nominating.description',
      },
      {
        title: 'nominate.definitions.nominations.title',
        description: 'nominate.definitions.nominations.description',
      },
      {
        title: 'nominate.definitions.inactive_nominations.title',
        description: 'nominate.definitions.inactive_nominations.description',
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
        title: 'pools.definitions.nomination_pools.title',
        description: 'pools.definitions.nomination_pools.description',
      },
      {
        title: 'pools.definitions.active_pools.title',
        description: 'pools.definitions.active_pools.description',
      },
      {
        title: 'pools.definitions.minimum_join_bond.title',
        description: 'pools.definitions.minimum_join_bond.description',
      },
      {
        title: 'pools.definitions.minimum_create_bond.title',
        description: 'pools.definitions.minimum_create_bond.description',
      },
      {
        title: 'pools.definitions.pool_membership.title',
        description: 'pools.definitions.pool_membership.description',
      },
      {
        title: 'pools.definitions.bonded_in_pool.title',
        description: 'pools.definitions.bonded_in_pool.description',
      },
      {
        title: 'pools.definitions.pool_rewards.title',
        description: 'pools.definitions.pool_rewards.description',
      },
      {
        title: 'pools.definitions.pool_roles.title',
        description: 'pools.definitions.pool_roles.description',
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
        title: 'validators.definitions.validator.title',
        description: 'validators.definitions.validator.description',
      },
      {
        title: 'validators.definitions.active_validator.title',
        description: 'validators.definitions.active_validator.description',
      },
      {
        title: 'validators.definitions.average_commission.title',
        description: 'validators.definitions.average_commission.description',
      },
      {
        title: 'validators.definitions.era.title',
        description: 'validators.definitions.era.description',
      },
      {
        title: 'validators.definitions.epoch.title',
        description: 'validators.definitions.epoch.description',
      },
      {
        title: 'validators.definitions.era_eoints.title',
        description: 'validators.definitions.era_eoints.description',
      },
      {
        title: 'validators.definitions.self_stake.title',
        description: 'validators.definitions.self_stake.description',
      },
      {
        title: 'validators.definitions.nominator_stake.title',
        description: 'validators.definitions.nominator_stake.description',
      },
      {
        title: 'validators.definitions.minimum_nomination_bond.title',
        description:
          'validators.definitions.minimum_nomination_bond.description',
      },
      {
        title: 'validators.definitions.commission.title',
        description: 'validators.definitions.commission.description',
      },
      {
        title: 'validators.definitions.over_subscribed.title',
        description: 'validators.definitions.over_subscribed.description',
      },
      {
        title: 'validators.definitions.blocked_nominations.title',
        description: 'validators.definitions.blocked_nominations.description',
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
        title: 'payouts.definitions.payout.title',
        description: 'payouts.definitions.payout.description',
      },
      {
        title: 'payouts.definitions.last_era_payout.title',
        description: 'payouts.definitions.last_era_payout.description',
      },
      {
        title: 'payouts.definitions.payout_history.title',
        description: 'payouts.definitions.payout_history.description',
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
