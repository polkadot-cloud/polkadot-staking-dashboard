// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccount } from '@polkadot-cloud/connect'
import { useActiveProxy } from 'contexts/ActiveProxy'
import { useApi } from 'contexts/Api'
import { useHelp } from 'contexts/Help'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import type { SubmittableExtrinsic } from 'dedot'
import { useBatchCall } from 'hooks/useBatchCall'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import 'rc-slider/assets/index.css'
import { formatFromProp } from 'hooks/useSubmitExtrinsic/util'
import { ButtonHelpTooltip } from 'library/ButtonHelpTooltip'
import { ModalBack } from 'library/ModalBack'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { perbillToPercent, percentToPerbill } from 'utils'
import { ChangeRate } from './ChangeRate'
import { CommissionCurrent } from './CommissionCurrent'
import { MaxCommission } from './MaxCommission'
import { usePoolCommission } from './provider'

export const ManageCommission = ({
	setSection,
	incrementCalculateHeight,
	onResize,
}: {
	setSection: Dispatch<SetStateAction<number>>
	incrementCalculateHeight: () => void
	onResize: () => void
}) => {
	const { t } = useTranslation('modals')
	const { openHelpTooltip } = useHelp()
	const {
		serviceApi,
		poolsConfig: { globalMaxCommission },
	} = useApi()
	const {
		initial,
		current,
		enabled,
		setFeatureEnabled,
		hasValue,
		resetAll,
		updated,
	} = usePoolCommission()
	const { newBatchCall } = useBatchCall()
	const { activeProxy } = useActiveProxy()
	const { closeModal } = useOverlay().modal
	const { isOwner, activePool } = useActivePool()
	const { getSignerWarnings } = useSignerWarnings()
	const { activeAddress, activeAccount } = useActiveAccount()
	const { getBondedPool, updateBondedPools } = useBondedPools()
	const globalMaxCommissionUnit =
		perbillToPercent(globalMaxCommission).toNumber()

	const poolId = activePool?.id || 0
	const bondedPool = getBondedPool(poolId)

	// Get currently set commission values.
	const { commission, payee, maxCommission, changeRate } = current

	// Valid to submit transaction
	const [valid, setValid] = useState<boolean>(false)

	// Monitor when input items change.
	const commissionUpdated: boolean = updated.commission

	// Global form change.
	const noChange: boolean =
		!commissionUpdated && !updated.maxCommission && !updated.changeRate

	// Monitor when input items are invalid.
	const commissionAboveMax: boolean =
		hasValue.maxCommission && commission > maxCommission
	const commissionAboveGlobal = commission > globalMaxCommissionUnit

	const commissionAboveMaxIncrease: boolean =
		hasValue.changeRate &&
		commission - initial.commission > changeRate.maxIncrease

	const invalidCurrentCommission: boolean =
		commissionUpdated &&
		((commission === 0 && payee !== null) ||
			(commission !== 0 && payee === null) ||
			commissionAboveMax ||
			commissionAboveMaxIncrease ||
			commission > globalMaxCommissionUnit)

	const invalidMaxCommission: boolean =
		hasValue.maxCommission &&
		updated.maxCommission &&
		maxCommission > initial.maxCommission

	const maxCommissionAboveGlobal: boolean =
		enabled.maxCommission && maxCommission > globalMaxCommissionUnit

	// Change rate is invalid if updated is not more restrictive than current.
	const invalidMaxIncrease: boolean =
		enabled.changeRate &&
		updated.changeRate &&
		changeRate.maxIncrease > initial.changeRate.maxIncrease

	const invalidMinDelay: boolean =
		enabled.changeRate &&
		updated.changeRate &&
		changeRate.minDelay < initial.changeRate.minDelay

	const invalidChangeRate: boolean = invalidMaxIncrease || invalidMinDelay

	const currentCommissionSet: boolean = payee !== null && commission !== 0
	const commissionPerbill = percentToPerbill(commission).toNumber()
	const maxCommissionPerbill = percentToPerbill(maxCommission).toNumber()
	const currentCommissionConfig: [number, string] | undefined =
		payee !== null && commission !== 0 ? [commissionPerbill, payee] : undefined

	// Check there are txs to submit.
	const txsToSubmit =
		commissionUpdated ||
		(updated.maxCommission && enabled.maxCommission) ||
		(updated.changeRate && enabled.changeRate)

	const getTx = () => {
		if (!valid) {
			return
		}
		const txs: (SubmittableExtrinsic | undefined)[] = []
		if (commissionUpdated) {
			txs.push(serviceApi.tx.poolSetCommission(poolId, currentCommissionConfig))
		}
		if (updated.maxCommission && enabled.maxCommission) {
			txs.push(serviceApi.tx.poolSetCommissionMax(poolId, maxCommissionPerbill))
		}
		if (updated.changeRate && enabled.changeRate) {
			const maxIncreasePerbill = percentToPerbill(
				changeRate.maxIncrease,
			).toNumber()
			txs.push(
				serviceApi.tx.poolSetCommissionChangeRate(
					poolId,
					maxIncreasePerbill,
					changeRate.minDelay,
				),
			)
		}
		const filteredTxs = txs.filter(
			(tx) => tx !== undefined,
		) as SubmittableExtrinsic[]

		if (filteredTxs.length === 1) {
			return filteredTxs[0]
		}
		return newBatchCall(filteredTxs, activeAddress, activeProxy)
	}

	const submitExtrinsic = useSubmitExtrinsic({
		tx: getTx(),
		from: formatFromProp(activeAccount, activeProxy),
		shouldSubmit: true,
		callbackSubmit: () => {
			closeModal()
		},
		callbackInBlock: () => {
			const pool = getBondedPool(poolId)
			if (pool) {
				const changeRatePerbill = percentToPerbill(
					changeRate.maxIncrease,
				).toNumber()
				updateBondedPools([
					{
						...pool,
						commission: {
							...pool.commission,
							current: currentCommissionSet
								? currentCommissionConfig
								: undefined,
							max: updated.maxCommission
								? maxCommissionPerbill
								: pool.commission?.max || undefined,
							changeRate: updated.changeRate
								? {
										maxIncrease: changeRatePerbill,
										minDelay: changeRate.minDelay,
									}
								: pool.commission?.changeRate || undefined,
						},
					},
				])
			}
		},
	})

	// Commission current meta required for form.
	const commissionCurrentMeta = {
		commissionAboveMax,
		commissionAboveGlobal,
		commissionAboveMaxIncrease,
	}

	// Max commission meta required for form.
	const maxCommissionMeta = {
		invalidMaxCommission,
		maxCommissionAboveGlobal,
	}

	// Change rate meta required for form.
	const changeRateMeta = {
		invalidMaxIncrease,
		invalidMinDelay,
	}

	// Get transaction signer warnings.
	const warnings = getSignerWarnings(
		activeAccount,
		false,
		submitExtrinsic.proxySupported,
	)

	// Update whether commission configs are valid on each invalid input, and when tx object changes.
	useEffect(() => {
		setValid(
			isOwner() &&
				!invalidCurrentCommission &&
				!commissionAboveGlobal &&
				!invalidMaxCommission &&
				!maxCommissionAboveGlobal &&
				!invalidChangeRate &&
				!noChange &&
				txsToSubmit,
		)
	}, [
		isOwner(),
		invalidCurrentCommission,
		invalidMaxCommission,
		commissionAboveGlobal,
		maxCommissionAboveGlobal,
		invalidChangeRate,
		bondedPool,
		noChange,
		txsToSubmit,
	])

	// Trigger modal resize when commission options are enabled / disabled.
	useEffect(() => {
		incrementCalculateHeight()
	}, [enabled.maxCommission, enabled.changeRate])

	return (
		<>
			<Padding horizontalOnly>
				{warnings.length > 0 ? (
					<Warnings>
						{warnings.map((text, i) => (
							<Warning key={`warning${i}`} text={text} />
						))}
					</Warnings>
				) : null}

				<ActionItem
					text={t('commissionRate')}
					inlineButton={
						<ButtonHelpTooltip
							definition="Pool Commission Rate"
							openHelp={openHelpTooltip}
						/>
					}
				/>
				<CommissionCurrent {...commissionCurrentMeta} />

				<ActionItem
					style={{
						marginTop: '2rem',
						borderBottomWidth: enabled.maxCommission ? '1px' : 0,
					}}
					text={t('maxCommission')}
					toggled={enabled.maxCommission}
					onToggle={(val) => setFeatureEnabled('maxCommission', val)}
					disabled={hasValue.maxCommission}
					inlineButton={
						<ButtonHelpTooltip
							definition="Pool Max Commission"
							openHelp={openHelpTooltip}
						/>
					}
				/>
				<MaxCommission {...maxCommissionMeta} />

				<ActionItem
					style={{
						marginTop: '2rem',
						borderBottomWidth: enabled.changeRate ? '1px' : 0,
					}}
					text={t('changeRate')}
					toggled={enabled.changeRate}
					onToggle={(val) => setFeatureEnabled('changeRate', val)}
					disabled={hasValue.changeRate}
					inlineButton={
						<ButtonHelpTooltip
							definition="Pool Commission Change Rate"
							openHelp={openHelpTooltip}
						/>
					}
				/>
				<ChangeRate {...changeRateMeta} />
			</Padding>
			<ModalBack
				onClick={() => {
					setSection(0)
					resetAll()
				}}
			/>
			<SubmitTx
				noMargin
				valid={valid}
				onResize={onResize}
				{...submitExtrinsic}
			/>
		</>
	)
}
