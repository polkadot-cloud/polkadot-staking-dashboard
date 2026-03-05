// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { planckToUnit, sortWithNull } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import type { AnnouncementItem } from 'library/Announcements/types'
import { AnnouncementsContainer, Item } from 'library/Announcements/Wrappers'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { Announcement as AnnouncementLoader } from 'library/Loader/Announcement'
import { useTranslation } from 'react-i18next'
import type { BondedPool } from 'types'
import { ButtonTertiary } from 'ui-buttons'
import { planckToUnitBn } from 'utils'

export const Announcements = ({ items }: { items: AnnouncementItem[] }) => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { bondedPools } = useBondedPools()
	const { openHelpTooltip } = useHelp()
	const {
		stakingMetrics: { totalStaked, lastReward },
	} = useApi()

	const { unit, units } = getStakingChainData(network)
	const lastRewardUnit = new BigNumber(planckToUnit(lastReward || 0, units))

	let totalPoolPoints = new BigNumber(0)
	bondedPools.forEach((b: BondedPool) => {
		totalPoolPoints = totalPoolPoints.plus(b.points)
	})
	const totalPoolPointsUnit = planckToUnitBn(totalPoolPoints, units)

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	const listItem = {
		hidden: {
			opacity: 0,
		},
		show: {
			opacity: 1,
		},
	}

	const announcements: Array<{
		class: string
		title: string
		subtitle: string
		category?: string
		button?: { text: string; onClick: () => void; disabled: boolean }
		helpKey?: string
		icon?: IconDefinition
	} | null> = [
		...items.map(({ label, value, category, button, helpKey }) => {
			// Show loader if value is zero, empty, or invalid
			if (!value || value === '0' || value === '0%') {
				return null
			}
			return {
				class: 'neutral',
				title: value,
				subtitle: label,
				category,
				button,
				helpKey,
				icon: undefined,
			}
		}),
	]

	// Total staked on the network
	if (totalStaked > 0n) {
		const totalStakedValue = new BigNumber(planckToUnit(totalStaked, units))
			.integerValue()
			.toFormat()
		announcements.push(
			totalStakedValue === '0'
				? null
				: {
						class: 'neutral',
						title: `${totalStakedValue} ${unit}`,
						subtitle: t('totalStaked'),
						category: t('participation'),
						button: undefined,
						helpKey: undefined,
						icon: undefined,
					},
		)
	} else {
		announcements.push(null)
	}

	// Total locked in pools
	if (bondedPools.length) {
		const totalPoolPointsValue = totalPoolPointsUnit.integerValue().toFormat()
		announcements.push(
			totalPoolPointsValue === '0'
				? null
				: {
						class: 'neutral',
						title: `${totalPoolPointsValue} ${unit}`,
						subtitle: t('bondedInPools', { networkUnit: unit }),
						category: t('pools'),
						button: undefined,
						helpKey: undefined,
						icon: undefined,
					},
		)
	} else {
		announcements.push(null)
	}

	// Last era payout
	if (lastRewardUnit.isGreaterThan(0)) {
		const lastRewardValue = lastRewardUnit.integerValue().toFormat()
		announcements.push(
			lastRewardValue === '0'
				? null
				: {
						class: 'neutral',
						title: `${lastRewardValue} ${unit}`,
						subtitle: t('lastEraPayout'),
						category: t('participation'),
						button: undefined,
						helpKey: undefined,
						icon: undefined,
					},
		)
	} else {
		announcements.push(null)
	}

	announcements.sort(sortWithNull(true))

	// Group announcements by category
	const grouped: Record<string, typeof announcements> = {}
	for (const announcement of announcements) {
		if (announcement !== null) {
			const cat = announcement.category || ''
			if (!grouped[cat]) {
				grouped[cat] = []
			}
			grouped[cat].push(announcement)
		} else {
			// Add nulls to first available category
			const firstKey = Object.keys(grouped)[0] || ''
			if (!grouped[firstKey]) {
				grouped[firstKey] = []
			}
			grouped[firstKey].push(null)
		}
	}

	return (
		<AnnouncementsContainer
			variants={container}
			initial="hidden"
			animate="show"
		>
			{Object.entries(grouped).map(([category, items]) => (
				<div key={category} className="category-section">
					<h2 className="category-header">{category}</h2>
					<div className="category-items">
						{items.map((item, index) =>
							item === null ? (
								<AnnouncementLoader key={`announcement_${category}_${index}`} />
							) : (
								<Item
									key={`announcement_${category}_${index}`}
									variants={listItem}
								>
									<h2 className={item.class}>
										{item.icon && <FontAwesomeIcon icon={item.icon} />}
										{item.title}
										{item.button && (
											<ButtonTertiary
												text={item.button.text}
												onClick={() => item.button?.onClick()}
												disabled={item.button.disabled}
											/>
										)}
									</h2>
									<h4>
										{item.subtitle}
										{item.helpKey && (
											<ButtonHelpTooltip
												marginLeft
												definition={item.helpKey}
												openHelp={openHelpTooltip}
											/>
										)}
									</h4>
								</Item>
							),
						)}
					</div>
				</div>
			))}
		</AnnouncementsContainer>
	)
}
