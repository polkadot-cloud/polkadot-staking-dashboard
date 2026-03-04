// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BigNumber from 'bignumber.js'
import { getStakingChain, getStakingChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import type { AnnouncementItem } from 'library/Announcements/types'
import { AnnouncementsContainer, Item } from 'library/Announcements/Wrappers'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { Announcement as AnnouncementLoader } from 'library/Loader/Announcement'
import { useTranslation } from 'react-i18next'
import { ButtonTertiary } from 'ui-buttons'
import { planckToUnitBn } from 'utils'

export const Announcements = ({ items }: { items: AnnouncementItem[] }) => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { getChainSpec } = useApi()
	const { activePool } = useActivePool()
	const { openHelpTooltip } = useHelp()

	const { unit, units } = getStakingChainData(network)
	const { rewardAccountBalance } = activePool || {}
	const { totalRewardsClaimed } = activePool?.rewardPool || {}
	const { existentialDeposit } = getChainSpec(getStakingChain(network))

	// calculate the latest reward account balance
	const rewardPoolBalance = BigNumber.max(
		0,
		new BigNumber(rewardAccountBalance || 0).minus(existentialDeposit),
	)
	const rewardBalance = planckToUnitBn(rewardPoolBalance, units)

	// calculate total rewards claimed
	const rewardsClaimed = planckToUnitBn(
		totalRewardsClaimed ? new BigNumber(totalRewardsClaimed) : new BigNumber(0),
		units,
	)

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.25,
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

	const announcements: Array<AnnouncementItem | null> = [
		...items.map(({ label, value, button, helpKey }) => {
			// Show loader if value is zero, empty, or invalid
			if (!value || value === '0' || value === '0%') {
				return null
			}
			return {
				class: 'neutral',
				label: label,
				value: value,
				button,
				helpKey,
				icon: undefined,
			}
		}),
	]

	// Total rewards claimed
	const rewardsClaimedValue = rewardsClaimed.decimalPlaces(3).toFormat()
	announcements.push(
		rewardsClaimedValue === '0'
			? null
			: {
					label: t('totalClaimed'),
					value: `${rewardsClaimedValue} ${unit}`,
					button: undefined,
					helpKey: undefined,
					icon: undefined,
				},
	)

	// Available to claim
	const rewardBalanceValue = rewardBalance.decimalPlaces(3).toFormat()
	announcements.push(
		rewardBalanceValue === '0'
			? null
			: {
					value: `${rewardBalanceValue} ${unit}`,
					label: t('availableToClaim', { unit }),
					button: undefined,
					helpKey: undefined,
					icon: undefined,
				},
	)

	return (
		<AnnouncementsContainer
			variants={container}
			initial="hidden"
			animate="show"
		>
			<div className="category-section">
				<div className="category-items">
					{announcements.map((item, index) =>
						item === null ? (
							<AnnouncementLoader key={`announcement_${index}`} />
						) : (
							<Item key={`announcement_${index}`} variants={listItem}>
								<h2>
									{item.icon && <FontAwesomeIcon icon={item.icon} />}
									{item.value}
									{item.button && (
										<ButtonTertiary
											text={item.button.text}
											onClick={() => item.button?.onClick()}
											disabled={item.button.disabled}
										/>
									)}
								</h2>
								<h4>
									{item.label}
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
		</AnnouncementsContainer>
	)
}
