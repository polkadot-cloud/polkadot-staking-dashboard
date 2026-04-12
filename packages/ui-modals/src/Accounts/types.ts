// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface AccountData {
	address: string
	source: string
}

export interface AccountMeta {
	address: string
	source: string
	name?: string
}

export interface ProxyDelegate {
	delegate: string
	proxyType: string
}

export interface ProxyInfo {
	address: string | null
	delegator: string | null
	delegates: ProxyDelegate[]
}

export interface PoolMembershipInfo {
	address: string
	poolId: number
	points: bigint
	balance: bigint
	lastRecordedRewardCounter: bigint
	unbondingEras: [number, bigint][]
	claimPermission: unknown
	pendingRewards: bigint
}

export interface ActiveProxyInfo {
	address: string
	source: string
	proxyType: string
}

export interface AccountItemData {
	address: string
	source: string
	delegates?: ProxyInfo
}

export interface AccountInPoolData {
	address: string
	source: string
	delegates?: ProxyInfo
	poolId: number
	points: bigint
	balance: bigint
	lastRecordedRewardCounter: bigint
	unbondingEras: [number, bigint][]
	claimPermission: unknown
	pendingRewards: bigint
}

export type AccountNominatingInPoolData = AccountItemData & AccountInPoolData

export interface AccountButtonProps {
	address: string
	source: string
	label?: string[]
	delegator?: string
	noBorder?: boolean
	proxyType?: string
	transferableBalance?: bigint
}

export interface DelegatesProps {
	delegator: string
	source: string
	delegates: ProxyInfo | undefined
}

export interface AccountsProps {
	accounts: AccountData[]
	activeAddress: string | null
	activeAccount: AccountData | null
	activeProxy: ActiveProxyInfo | null
	activeProxyType: string | null
	setActiveAccount: (account: AccountData | null) => void
	setActiveProxy: (network: string, proxy: ActiveProxyInfo | null) => void
	getDelegates: (address: string | null) => ProxyInfo | undefined
	getStakingLedger: (address: string) => {
		ledger: unknown | undefined
	}
	getPoolMembership: (address: string) => {
		membership: PoolMembershipInfo | undefined
	}
	getAccount: (
		opts: {
			address: string
			source: string
		} | null,
	) => AccountMeta | null
	getImportedAccounts: () => AccountData[]
	getTransferableBalance: (address: string) => bigint
	isSupportedProxy: (proxyType: string) => boolean
	network: string
	unit: string
	units: number
	t: (key: string) => string
}
