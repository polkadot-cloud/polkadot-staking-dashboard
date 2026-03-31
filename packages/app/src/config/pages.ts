// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
	faChartSimple,
	faCoins,
	faHome,
	faMagnifyingGlass,
	faTableList,
	faUserGear,
	faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { lazy } from 'react'
import type { PageCategoryItems, PagesConfigItems } from 'types'

const Overview = lazy(() =>
	import('pages/Overview').then((m) => ({ default: m.Overview })),
)
const Stake = lazy(() =>
	import('pages/Stake').then((m) => ({ default: m.Stake })),
)
const Pools = lazy(() =>
	import('pages/Pools').then((m) => ({ default: m.Pools })),
)
const Nominate = lazy(() =>
	import('pages/Nominate').then((m) => ({ default: m.Nominate })),
)
const Rewards = lazy(() =>
	import('pages/Rewards').then((m) => ({ default: m.Rewards })),
)
const Validators = lazy(() =>
	import('pages/Validators').then((m) => ({ default: m.Validators })),
)
const Operators = lazy(() =>
	import('pages/Operators').then((m) => ({ default: m.Operators })),
)
const PoolsList = lazy(() =>
	import('pages/PoolsList').then((m) => ({ default: m.PoolsList })),
)

export const PageCategories: PageCategoryItems = [
	{
		id: 2,
		key: 'stake',
		advanced: false,
		defaultRoute: '/overview',
	},
	{
		id: 3,
		key: 'validators',
		advanced: true,
		defaultRoute: '/validators',
	},
	{
		id: 4,
		key: 'pools',
		advanced: true,
		defaultRoute: '/pools',
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
		key: 'stake',
		uri: `${import.meta.env.BASE_URL}stake`,
		hash: '/stake',
		Entry: Stake,
		faIcon: faCoins,
		advanced: false,
	},
	{
		category: 2,
		key: 'pool',
		uri: `${import.meta.env.BASE_URL}pool`,
		hash: '/pool',
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
		advanced: true,
	},
	{
		category: 3,
		key: 'operators',
		uri: `${import.meta.env.BASE_URL}operators`,
		hash: '/operators',
		Entry: Operators,
		faIcon: faTableList,
		advanced: true,
	},
	{
		category: 4,
		key: 'pools',
		uri: `${import.meta.env.BASE_URL}pools`,
		hash: '/pools',
		Entry: PoolsList,
		faIcon: faMagnifyingGlass,
		advanced: true,
	},
]
