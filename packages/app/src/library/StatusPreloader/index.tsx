// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { Loader, Separator } from 'ui-core/base'

export const StatusPreloader = ({ height }: { height: number }) => {
	const TitlePreloader = (
		<Loader
			style={{
				height: '1.5rem',
				width: '30%',
				marginBottom: '1rem',
			}}
		/>
	)
	const SubtitlePreloader = (
		<Loader
			style={{
				height: '2.25rem',
				width: '60%',
			}}
		/>
	)

	return (
		<CardWrapper height={height}>
			<div
				style={{
					padding: '0.5rem 0',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{TitlePreloader}
				{SubtitlePreloader}
			</div>
			<Separator />
			<div
				style={{
					padding: '0.5rem 0',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{TitlePreloader}
				{SubtitlePreloader}
			</div>
		</CardWrapper>
	)
}
