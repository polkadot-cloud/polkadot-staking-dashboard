// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress, NominationStatus } from 'types'

export interface EraStakersContextInterface {
	eraStakers: EraStakers
	activeValidators: number
	activeNominatorsCount: number
	getNominationsStatusFromEraStakers: (
		who: MaybeAddress,
		targets: string[],
	) => Record<string, NominationStatus>
	fetchEraStakers: (era: string) => Promise<Exposure[]>
	isNominatorActive: (who: string) => boolean
	getActiveValidator: (who: string) => Staker | undefined
}

export interface ActiveAccountOwnStake {
	address: string
	value: string
}
export interface EraStakers {
	activeAccountOwnStake: ActiveAccountOwnStake[]
	stakers: Staker[]
}

export type Staker = ExposureValue & {
	address: string
}

export interface Exposure {
	keys: string[]
	val: ExposureValue
}

export interface ExposureValue {
	others: ExposureOther[]
	own: string
	total: string
}

export interface ExposureOther {
	who: string
	value: string
}

export interface LocalExposuresData {
	era: string
	exposures: LocalExposure[]
}

export interface LocalExposure {
	k: [string, string]
	v: {
		o: [string, string]
		w: string
		t: string
	}
}
