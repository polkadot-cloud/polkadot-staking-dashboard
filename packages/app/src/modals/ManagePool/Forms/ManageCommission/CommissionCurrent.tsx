// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PerbillMultiplier } from 'consts'
import { useApi } from 'contexts/Api'
import { AccountInput } from 'library/AccountInput'
import { StyledSlider } from 'library/StyledSlider'
import { SliderWrapper } from 'modals/ManagePool/Wrappers'
import { useTranslation } from 'react-i18next'
import { usePoolCommission } from './provider'

export const CommissionCurrent = ({
	commissionAboveMax,
	commissionAboveGlobal,
	commissionAboveMaxIncrease,
}: {
	commissionAboveMax: boolean
	commissionAboveGlobal: boolean
	commissionAboveMaxIncrease: boolean
}) => {
	const { t } = useTranslation()
	const {
		getEnabled,
		getInitial,
		getCurrent,
		setPayee,
		setCommission,
		setMaxCommission,
		isUpdated,
	} = usePoolCommission()
	const { globalMaxCommission } = useApi().poolsConfig

	// Get the current commission, payee and max commission values.
	const commission = getCurrent('commission')
	const payee = getCurrent('payee')
	const maxCommission = getCurrent('max_commission')
	const commissionUnit = commission / PerbillMultiplier
	const globalMaxCommissionUnit = globalMaxCommission / PerbillMultiplier

	// Determine the commission feedback to display.
	const commissionFeedback = (() => {
		if (!isUpdated('commission')) {
			return undefined
		}
		if (commissionAboveMaxIncrease) {
			return {
				text: t('beyondMaxIncrease', { ns: 'modals' }),
				label: 'danger',
			}
		}
		if (commissionAboveGlobal) {
			return {
				text: t('aboveGlobalMax', { ns: 'modals' }),
				label: 'danger',
			}
		}
		if (commissionAboveMax) {
			return {
				text: t('aboveMax', { ns: 'modals' }),
				label: 'danger',
			}
		}
		return {
			text: t('updated', { ns: 'modals' }),
			label: 'neutral',
		}
	})()

	return (
		<>
			<SliderWrapper>
				<div>
					<h2>{commissionUnit}% </h2>
					<h5 className={commissionFeedback?.label || 'neutral'}>
						{!!commissionFeedback && commissionFeedback.text} /{' '}
						{globalMaxCommissionUnit}% {t('max', { ns: 'app' })}
					</h5>
				</div>

				<StyledSlider
					max={globalMaxCommissionUnit}
					value={commissionUnit}
					step={0.05}
					onChange={(val) => {
						if (typeof val === 'number') {
							val = Number(val.toFixed(2))

							setCommission(val * PerbillMultiplier)
							if (val > maxCommission && getEnabled('max_commission')) {
								setMaxCommission(
									Math.min(
										getInitial('max_commission') * PerbillMultiplier,
										val,
									),
								)
							}
						}
					}}
				/>
			</SliderWrapper>

			<AccountInput
				defaultLabel={t('inputPayeeAccount', { ns: 'modals' })}
				successLabel={t('payeeAdded', { ns: 'modals' })}
				locked={payee !== null}
				successCallback={async (input) => {
					setPayee(input)
				}}
				resetCallback={() => {
					setPayee(null)
				}}
				disallowAlreadyImported={false}
				initialValue={payee}
				inactive={commissionUnit === 0}
				border={payee === null}
			/>
		</>
	)
}
