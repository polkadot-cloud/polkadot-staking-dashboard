// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faChartSimple,
	faHome,
	faMagnifyingGlass,
	faTableList,
	faUserGear,
	faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { Nominate } from 'pages/Nominate'
import { Operators } from 'pages/Operators'
import { Overview } from 'pages/Overview'
import { Pools } from 'pages/Pools'
import { Rewards } from 'pages/Rewards'
import { Validators } from 'pages/Validators'
import type { PageCategoryItems, PagesConfigItems } from 'types'

export const PageCategories: PageCategoryItems = [
	{
		id: 1,
		key: 'default',
		advanced: false,
	},
	{
		id: 2,
		key: 'stake',
		advanced: false,
	},
	{
		id: 3,
		key: 'validators',
		advanced: true,
	},
]

export const PagesConfig: PagesConfigItems = [
	{
		category: 2,
		key: 'overview',
		uri: `${import.meta.env.BASE_URL}`,
		hash: '/overview',
		Entry: Overview,
		faIcon: faHome,
		advanced: false,
	},
	{
		category: 2,
		key: 'pools',
		uri: `${import.meta.env.BASE_URL}pools`,
		hash: '/pools',
		Entry: Pools,
		faIcon: faUsers,
		advanced: false,
	},
	{
		category: 2,
		key: 'nominate',
		uri: `${import.meta.env.BASE_URL}nominate`,
		hash: '/nominate',
		Entry: Nominate,
		faIcon: faUserGear,
		advanced: false,
	},
	{
		category: 2,
		key: 'rewards',
		uri: `${import.meta.env.BASE_URL}rewards`,
		hash: '/rewards',
		Entry: Rewards,
		faIcon: faChartSimple,
		advanced: false,
	},
	{
		category: 3,
		key: 'validators',
		uri: `${import.meta.env.BASE_URL}validators`,
		hash: '/validators',
		Entry: Validators,
		faIcon: faMagnifyingGlass,
		advanced: false,
	},
	{
		category: 3,
		key: 'operators',
		uri: `${import.meta.env.BASE_URL}operators`,
		hash: '/operators',
		Entry: Operators,
		faIcon: faTableList,
		advanced: false,
	},
]
