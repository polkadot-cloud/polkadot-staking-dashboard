// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HelpItems } from 'contexts/Help/types';

export const HELP_CONFIG: HelpItems = [
  {
    key: 'overview',
    definitions: [
      'Dashboard Tips',
      'Total Nominators',
      'Active Nominators',
      'Your Balance',
      'Reserve Balance',
      'Network Stats',
      'Inflation',
      'Historical Rewards Rate',
      'Ideal Staked',
      'Supply Staked',
    ],
    external: [
      [
        'connectAccounts',
        'https://support.polkadot.network/support/solutions/articles/65000182121-how-to-use-the-staking-dashboard-connecting-your-account',
        'polkadot.network',
      ],
      [
        'howToUse',
        'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        'polkadot.network',
      ],
      [
        'stakeDot',
        'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        'polkadot.network',
      ],
    ],
  },
  {
    key: 'nominate',
    definitions: [
      'Nomination Status',
      'Stash and Controller Accounts',
      'Controller Account Eligibility',
      'Bonding',
      'Active Bond Threshold',
      'Reward Destination',
      'Nominating',
      'Nominations',
      'Inactive Nominations',
    ],
    external: [
      [
        'changeDestination',
        'https://support.polkadot.network/support/solutions/articles/65000182220-how-to-use-the-staking-dashboard-changing-reward-destination',
        'polkadot.network',
      ],
      [
        'bondMore',
        'https://support.polkadot.network/support/solutions/articles/65000182207-how-to-use-the-staking-dashboard-bond-more-tokens-to-your-existing-stake',
        'polkadot.network',
      ],
      [
        'unbondingTokens',
        'https://support.polkadot.network/support/solutions/articles/65000182201-how-to-use-the-staking-dashboard-unbonding-your-tokens',
        'polkadot.network',
      ],
      [
        'rebonding',
        'https://support.polkadot.network/support/solutions/articles/65000182221-how-to-use-the-staking-dashboard-rebonding',
        'polkadot.network',
      ],
      [
        'changeAccount',
        'https://support.polkadot.network/support/solutions/articles/65000182218-how-to-use-the-staking-dashboard-changing-your-controller-account',
        'polkadot.network',
      ],
      [
        'changeNominations',
        'https://support.polkadot.network/support/solutions/articles/65000182518-how-to-use-the-staking-dashboard-changing-your-nominations',
        'polkadot.network',
      ],
    ],
  },
  {
    key: 'pools',
    definitions: [
      'Nomination Pools',
      'Active Pools',
      'Minimum Join Bond',
      'Minimum Create Bond',
      'Pool Membership',
      'Bonded in Pool',
      'Pool Rewards',
      'Pool Roles',
    ],
    external: [
      [
        'createPools',
        'https://support.polkadot.network/support/solutions/articles/65000182388-how-to-use-the-staking-dashboard-creating-nomination-pools',
        'polkadot.network',
      ],
      [
        'claimRewards',
        'https://support.polkadot.network/support/solutions/articles/65000182399-how-to-use-staking-dashboard-claiming-nomination-pool-rewards',
        'polkadot.network',
      ],
    ],
  },
  {
    key: 'validators',
    definitions: [
      'Validator',
      'Active Validator',
      'Average Commission',
      'Era',
      'Epoch',
      'Era Points',
      'Self Stake',
      'Nominator Stake',
      'Commission',
      'Over Subscribed',
      'Blocked Nominations',
    ],
    external: [
      [
        'chooseValidators',
        'https://support.polkadot.network/support/solutions/articles/65000150130-how-do-i-know-which-validators-to-choose-',
        'polkadot.network',
      ],
    ],
  },
  {
    key: 'payouts',
    definitions: ['Payout', 'Last Era Payout', 'Payout History'],
    external: [],
  },
  {
    key: 'community',
    definitions: [],
    external: [],
  },
];
