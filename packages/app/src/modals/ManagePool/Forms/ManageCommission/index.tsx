// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBolt, faChartLine, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ModalBack } from 'library/ModalBack'
import 'rc-slider/assets/index.css'
import { ItemsWrapper, ItemWrapper } from 'modals/StakingOptions/Wrappers'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { ManageChangeRate } from './ManageChangeRate'
import { ManageCurrentCommission } from './ManageCurrentCommission'
import { ManageMaxCommission } from './ManageMaxCommission'
import { usePoolCommission } from './provider'

type CommissionView = 'options' | 'commission' | 'maxCommission' | 'changeRate'

export const ManageCommission = ({
	setSection,
	incrementCalculateHeight,
	onResize,
}: {
	setSection: Dispatch<SetStateAction<number>>
	incrementCalculateHeight: () => void
	onResize: () => void
}) => {
	const { t } = useTranslation(['app', 'modals'])
	const { current, hasValue, resetAll, setFeatureEnabled } = usePoolCommission()
	const [view, setView] = useState<CommissionView>('options')

	const handleBack = () => {
		if (view === 'options') {
			setSection(0)
			resetAll()
			return
		}
		setView('options')
		resetAll()
	}

	useEffect(() => {
		incrementCalculateHeight()
	}, [view, incrementCalculateHeight])

	return (
		<>
			{view === 'options' ? (
				<>
					<ModalBack onClick={handleBack} />
					<Padding horizontalOnly style={{ marginTop: '1rem' }}>
						<ItemsWrapper>
							<ItemWrapper
								type="button"
								onClick={() => {
									setView('commission')
								}}
							>
								<FontAwesomeIcon icon={faBolt} size="2x" />
								<h2>{t('commissionRate', { ns: 'modals' })}</h2>
								<h3>
									{current.commission}% ·{' '}
									{current.payee === null
										? t('manageCommission.payeeNotSetLabel', { ns: 'modals' })
										: t('manageCommission.payeeSetLabel', { ns: 'modals' })}
								</h3>
							</ItemWrapper>

							<ItemWrapper
								type="button"
								onClick={() => {
									setFeatureEnabled('maxCommission', true)
									setView('maxCommission')
								}}
							>
								<FontAwesomeIcon icon={faCog} size="2x" />
								<h2>{t('maxCommission', { ns: 'modals' })}</h2>
								{hasValue.maxCommission ? (
									<h3>{current.maxCommission}%</h3>
								) : null}
							</ItemWrapper>

							<ItemWrapper
								type="button"
								onClick={() => {
									setFeatureEnabled('changeRate', true)
									setView('changeRate')
								}}
							>
								<FontAwesomeIcon icon={faChartLine} size="2x" />
								<h2>{t('changeRate', { ns: 'modals' })}</h2>
								<h3>
									{current.changeRate.maxIncrease}% /{' '}
									{t('manageCommission.blocksLabel', {
										ns: 'modals',
										blocks: current.changeRate.minDelay.toLocaleString(),
									})}
								</h3>
							</ItemWrapper>
						</ItemsWrapper>
					</Padding>
				</>
			) : null}

			{view === 'commission' ? (
				<ManageCurrentCommission onResize={onResize} onBack={handleBack} />
			) : null}
			{view === 'maxCommission' ? (
				<ManageMaxCommission onResize={onResize} onBack={handleBack} />
			) : null}
			{view === 'changeRate' ? (
				<ManageChangeRate onResize={onResize} onBack={handleBack} />
			) : null}
		</>
	)
}
