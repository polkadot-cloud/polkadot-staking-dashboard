// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useThemeValues } from 'contexts/ThemeValues'
import { useHalving } from 'hooks/useHalving'
import { Countdown } from 'library/Countdown'
import { useTranslation } from 'react-i18next'
import { Countdown as CountdownWrapper } from 'ui-core/base'
import { HalvingLine } from 'ui-graphs'
import { StatusWrapper } from '../Wrappers'

export const Halving = () => {
	const { t } = useTranslation()
	const { getThemeValue } = useThemeValues()
	const { timeleft } = useHalving()

	return (
		<StatusWrapper>
			<div
				style={{
					padding: '0 1.25rem 1.25rem 1rem',
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				<h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					{t('nextHalving', { ns: 'app' })}:{' '}
					<CountdownWrapper>
						<Countdown timeleft={timeleft} />
					</CountdownWrapper>
				</h3>
				<div style={{ marginTop: '1rem', flex: 1, minHeight: 0 }}>
					<HalvingLine
						width="100%"
						height="100%"
						getThemeValue={getThemeValue}
						labels={{
							year: t('year', { ns: 'app' }),
							issuance: t('newIssuance', { ns: 'app' }),
							newIssuance: t('newIssuance', { ns: 'app' }),
						}}
					/>
				</div>
			</div>
		</StatusWrapper>
	)
}
