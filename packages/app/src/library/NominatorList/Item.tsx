// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { CopyAddress } from 'library/ListItem/Buttons/CopyAddress'
import { Identity } from 'library/ListItem/Labels/Identity'
import { Wrapper } from 'library/ListItem/Wrappers'
import { useMemo } from 'react'
import { HeaderButtonRow, Label, LabelRow, Separator } from 'ui-core/list'
import { NominationStatus } from '../ListItem/Labels/NominationStatus'
import type { NominatorListItemProps } from './types'
import { VerticalPayoutPerformance } from './VerticalPayoutPerformance'

const generatePerformanceSeries = (total30d: number, seedText: string) => {
	const days = 30
	if (total30d <= 0) {
		return Array.from({ length: days }, () => 0)
	}

	const seed = seedText
		.split('')
		.reduce((acc, char) => acc + char.charCodeAt(0), 0)
	const base = total30d / days
	const raw = Array.from({ length: days }, (_, i) => {
		const wave = 0.75 + 0.25 * Math.sin((i + 1) * 0.55 + seed * 0.03)
		const variation = 0.65 + 0.35 * Math.cos((i + 1) * 0.31 + seed * 0.07)
		return Math.max(base * wave * variation, 0)
	})
	const sum = raw.reduce((acc, value) => acc + value, 0)
	const factor = sum > 0 ? total30d / sum : 0
	return raw.map((value) => value * factor)
}

export const Item = ({ item, unit }: NominatorListItemProps) => {
	const address = item.address || ''
	const performance = useMemo(
		() =>
			item.performance30d ||
			generatePerformanceSeries(item.incomingPayouts30d, address),
		[item.performance30d, item.incomingPayouts30d, address],
	)

	const formattedStake = `${new BigNumber(item.stakedBalance).toFormat(3)} ${unit}`

	if (!item.address) {
		return null
	}

	return (
		<Wrapper>
			<div className="inner default">
				<div className="row top">
					<Identity address={address} />
					<div>
						<HeaderButtonRow>
							<CopyAddress address={address} />
						</HeaderButtonRow>
					</div>
				</div>

				<Separator />

				<div className="row bottom lg">
					<div>
						<VerticalPayoutPerformance amounts={performance} />
					</div>
					<div>
						<LabelRow inline>
							<Label>{formattedStake}</Label>
						</LabelRow>
						<LabelRow>
							<NominationStatus
								address={address}
								bondFor={'nominator'}
								nominator={address}
								status={'active'}
								asIncoming
								noMargin
							/>
						</LabelRow>
					</div>
				</div>
			</div>
		</Wrapper>
	)
}
