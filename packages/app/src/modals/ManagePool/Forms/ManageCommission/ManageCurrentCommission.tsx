// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccount } from '@polkadot-cloud/connect'
import { useActiveProxy } from 'contexts/ActiveProxy'
import { useApi } from 'contexts/Api'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { formatFromProp } from 'hooks/useSubmitExtrinsic/util'
import { Warning } from 'library/Form/Warning'
import { ModalBack } from 'library/ModalBack'
import { SubmitTx } from 'library/SubmitTx'
import { useTranslation } from 'react-i18next'
import { Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { perbillToPercent, percentToPerbill } from 'utils'
import { CommissionCurrent } from './CommissionCurrent'
import { usePoolCommission } from './provider'

interface ManageCurrentCommissionProps {
	onResize: () => void
	onBack: () => void
}

export const ManageCurrentCommission = ({
	onResize,
	onBack,
}: ManageCurrentCommissionProps) => {
	const { t } = useTranslation('modals')
	const {
		serviceApi,
		poolsConfig: { globalMaxCommission },
	} = useApi()
	const { activeProxy } = useActiveProxy()
	const { closeModal } = useOverlay().modal
	const { isOwner, activePool } = useActivePool()
	const { getSignerWarnings } = useSignerWarnings()
	const { activeAccount } = useActiveAccount()
	const { getBondedPool, updateBondedPools } = useBondedPools()
	const { initial, current, hasValue, updated } = usePoolCommission()
	const globalMaxCommissionUnit =
		perbillToPercent(globalMaxCommission).toNumber()
	const poolId = activePool?.id || 0

	const { commission, payee, maxCommission, changeRate } = current

	const commissionAboveMax =
		hasValue.maxCommission && commission > maxCommission
	const commissionAboveGlobal = commission > globalMaxCommissionUnit
	const commissionAboveMaxIncrease =
		hasValue.changeRate &&
		commission - initial.commission > changeRate.maxIncrease

	const invalidCurrentCommission =
		(commission === 0 && payee !== null) ||
		(commission !== 0 && payee === null) ||
		commissionAboveMax ||
		commissionAboveMaxIncrease ||
		commissionAboveGlobal

	const valid = isOwner() && updated.commission && !invalidCurrentCommission
	const commissionPerbill = percentToPerbill(commission).toNumber()
	const currentCommissionConfig: [number, string] | undefined =
		payee !== null && commission !== 0 ? [commissionPerbill, payee] : undefined

	const tx = valid
		? serviceApi.tx.poolSetCommission(poolId, currentCommissionConfig)
		: undefined

	const submitExtrinsic = useSubmitExtrinsic({
		tx,
		from: formatFromProp(activeAccount, activeProxy),
		shouldSubmit: valid,
		callbackSubmit: () => {
			closeModal()
		},
		callbackInBlock: () => {
			const pool = getBondedPool(poolId)
			if (pool) {
				updateBondedPools([
					{
						...pool,
						commission: {
							...pool.commission,
							current: currentCommissionConfig,
						},
					},
				])
			}
		},
	})

	const warnings = getSignerWarnings(
		activeAccount,
		false,
		submitExtrinsic.proxySupported,
	)

	const invalidWarnings: string[] = []
	if (!updated.commission) {
		invalidWarnings.push(t('manageCommission.noCommissionChangesWarning'))
	}
	if (commission === 0 && payee !== null) {
		invalidWarnings.push(t('manageCommission.payeeMustBeNoneWarning'))
	}
	if (commission !== 0 && payee === null) {
		invalidWarnings.push(t('manageCommission.payeeRequiredWarning'))
	}
	if (commissionAboveMax) {
		invalidWarnings.push(
			t('manageCommission.commissionAboveMaxWarning', {
				max: maxCommission,
			}),
		)
	}
	if (commissionAboveMaxIncrease) {
		invalidWarnings.push(
			t('manageCommission.commissionBeyondMaxIncreaseWarning', {
				maxIncrease: changeRate.maxIncrease,
			}),
		)
	}
	if (commissionAboveGlobal) {
		invalidWarnings.push(
			t('manageCommission.commissionAboveGlobalMaxWarning', {
				max: globalMaxCommissionUnit,
			}),
		)
	}

	return (
		<>
			<Padding horizontalOnly>
				<Warnings>
					{warnings.map((text, i) => (
						<Warning key={`warning${i}`} text={text} />
					))}
					{!valid &&
						invalidWarnings.map((text, i) => (
							<Warning key={`invalid-warning${i}`} text={text} />
						))}
				</Warnings>
				<CommissionCurrent />
			</Padding>
			<ModalBack onClick={onBack} />
			<SubmitTx
				noMargin
				valid={valid}
				onResize={onResize}
				{...submitExtrinsic}
			/>
		</>
	)
}
