// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { HelpItems } from 'contexts/Help/types'

export const HelpConfig: HelpItems = [
	{
		key: 'vault',
		definitions: ['Polkadot Vault'],
	},
	{
		key: 'overview',
		definitions: [
			'Total Nominators',
			'Active Nominators',
			'Your Balance',
			'Reserve Balance',
			'Locked Balance',
			'Average Reward Rate',
			'Inflation',
			'Ideal Staked',
			'Supply Staked',
			'Read Only Accounts',
			'Proxy Accounts',
			'Reserve Balance For Existential Deposit',
		],
	},
	{
		key: 'nominate',
		definitions: [
			'Nomination Status',
			'Bonding',
			'Active Stake Threshold',
			'Payout Destination',
			'Nominating',
			'Nominations',
			'Inactive Nominations',
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
			'Pool Reward History',
		],
	},
	{
		key: 'decentralization',
		definitions: [
			'Decentralization Analytics Period',
			'Geolocation of Each Nomination',
			'Nomination Payout Distribution',
			'Total Payouts Analysed',
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
			'Blocked Nominations',
			'Rewards By Country And Network',
			'Validator Reward History',
		],
	},
	{
		key: 'payouts',
		definitions: ['Payout', 'Last Era Payout', 'Payout History'],
	},
	{
		key: 'community',
		definitions: [],
	},
	{
		key: 'ledger',
		definitions: [
			'Ledger Hardware Wallets',
			'Ledger Rejected Transaction',
			'Ledger Request Timeout',
			'Open App On Ledger',
			'Ledger App Not on Latest Runtime Version',
			'Wrong Transaction',
		],
	},
]
