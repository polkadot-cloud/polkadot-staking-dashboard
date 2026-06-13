// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface IncomingProjectionAccount {
	address: string
	label: string
	stakedBalance: number
	validatorApy: number
	incomingPayouts30d: number
}

export const mockIncomingProjectionAccounts: IncomingProjectionAccount[] = [
	{
		address: '14QXQYkP5kR6dwd5aN4A8TR6S4QbM2T8sNY2G1yq9Vyhj8kF',
		label: 'Treasury Nominator',
		stakedBalance: 1245.77,
		validatorApy: 14.22,
		incomingPayouts30d: 38.61,
	},
	{
		address: '14Y3oNwzHnNf9JX2gqUu5A2nW5vC2xq7YbgxMeG3Qq9x4A7r',
		label: 'Ops Vault',
		stakedBalance: 542.18,
		validatorApy: 13.84,
		incomingPayouts30d: 16.42,
	},
	{
		address: '1zugcKfQWPaYJ8mQG1qSgH7hM8oV4qX1mXx3V8mXegX8z5k',
		label: 'Contributor',
		stakedBalance: 320.05,
		validatorApy: 15.01,
		incomingPayouts30d: 11.83,
	},
]
