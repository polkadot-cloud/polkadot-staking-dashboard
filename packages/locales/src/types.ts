// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface LocaleJson {
	[key: string]:
		| string
		| string[]
		| string[][]
		| (string | string[])[]
		| LocaleJson
		| LocaleJson[]
}

export type LocaleJsonValue =
	| string
	| string[]
	| string[][]
	| (string | string[])[]
	| LocaleJson
	| LocaleJson[]

export interface LocaleEntry {
	label: string
}
