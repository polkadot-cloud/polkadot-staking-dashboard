// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HelpItems } from 'contexts/Help/types';

export const HelpConfig: HelpItems = [
  {
    key: 'overview',
    definitions: [
      'Total Nominators',
      'Active Nominators',
      'Your Balance',
      'Reserve Balance',
      'Locked Balance',
      'Network Stats',
      'Historical Rewards Rate',
      'Adjusted Rewards Rate',
      'Inflation',
      'Ideal Staked',
      'Supply Staked',
      'Read Only Accounts',
      'Proxy Accounts',
    ],
    external: [
      ['connectAccounts', 'https://docs.creditcoin.org', 'docs.creditcoin.org'],
      ['howToUse', 'https://docs.creditcoin.org', 'docs.creditcoin.org'],
      ['stakeDot', 'https://docs.creditcoin.org', 'docs.creditcoin.org'],
    ],
  },
  {
    key: 'nominate',
    definitions: [
      'Nomination Status',
      'Stash and Controller Accounts',
      'Controller Account Eligibility',
      'Bonding',
      'Active Stake Threshold',
      'Payout Destination',
      'Nominating',
      'Nominations',
      'Inactive Nominations',
    ],
    external: [
      [
        'changeDestination',
        'https://docs.creditcoin.org',
        'docs.creditcoin.org',
      ],
      ['bondMore', 'https://docs.creditcoin.org', 'docs.creditcoin.org'],
      ['unbondingTokens', 'https://docs.creditcoin.org', 'docs.creditcoin.org'],
      ['rebonding', 'https://docs.creditcoin.org', 'docs.creditcoin.org'],
      ['changeAccount', 'https://docs.creditcoin.org', 'docs.creditcoin.org'],
      [
        'changeNominations',
        'https://docs.creditcoin.org',
        'docs.creditcoin.org',
      ],
    ],
  },
  {
    key: 'pools',
    definitions: [
      'Nomination Pools',
      'Active Pools',
      'Minimum To Join Pool',
      'Minimum To Create Pool',
      'Pool Membership',
      'Bonded in Pool',
      'Pool Rewards',
      'Pool Roles',
      'Pool Commission Rate',
      'Pool Max Commission',
      'Pool Commission Change Rate',
    ],
    external: [
      ['createPools', 'https://docs.creditcoin.org', 'docs.creditcoin.org'],
      ['claimRewards', 'https://docs.creditcoin.org', 'docs.creditcoin.org'],
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
        'https://docs.creditcoin.org',
        'docs.creditcoin.org',
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
  {
    key: 'ledger',
    definitions: [
      'Ledger Hardware Wallets',
      'Ledger Rejected Transaction',
      'Ledger Request Timeout',
      'Open App On Ledger',
      'Wrong Transaction',
    ],
    external: [],
  },
  {
    key: 'vault',
    definitions: ['Polkadot Vault'],
  },
];
