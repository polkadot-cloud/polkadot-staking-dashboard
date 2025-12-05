// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { InputWrapper } from '../Wrappers'
import type { BalanceInputProps } from './types'

export const BalanceInput = ({
	setters = [],
	disabled,
	defaultValue,
	maxAvailable,
	disableTxFeeUpdate = false,
	value = '0',
	syncing = false,
}: BalanceInputProps) => {
	const { t } = useTranslation('app')
	const { network } = useNetwork()
	const { activeAddress } = useActiveAccounts()
	const { unit } = getStakingChainData(network)

	// the current local token value
	const [localValue, setLocalValue] = useState<string>(value)

	// reset value to default when changing account
	useEffect(() => {
		setLocalValue(defaultValue ?? '0')
	}, [activeAddress])

	useEffect(() => {
		if (!disableTxFeeUpdate) {
			setLocalValue(value.toString())
		}
	}, [value])

	// handle value change
	const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		if (val !== '' && new BigNumber(val).isNaN()) {
			return
		}
		setLocalValue(val)
		updateParentState(val)
	}

	// apply value to parent setters
	const updateParentState = (val: string) => {
		val = val || '0'
		if (new BigNumber(val).isNaN()) {
			return
		}
		for (const setter of setters) {
			setter({
				bond: new BigNumber(val),
			})
		}
	}

	// available funds as jsx
	const availableFundsJsx = (
		<p>
			{syncing ? '...' : `${maxAvailable.toFormat()} ${unit} ${t('available')}`}
		</p>
	)

	return (
		<InputWrapper>
			<div className="inner">
				<section style={{ opacity: disabled ? 0.5 : 1 }}>
					<div className="input">
						<div>
							<input
								type="text"
								placeholder={`0 ${unit}`}
								value={localValue}
								onChange={(e) => {
									handleChangeValue(e)
								}}
								disabled={disabled}
							/>
						</div>
						<div>{availableFundsJsx}</div>
					</div>
					<ButtonSubmitInvert
						text={t('max')}
						disabled={disabled || syncing || maxAvailable.isZero()}
						onClick={() => {
							setLocalValue(maxAvailable.toString())
							updateParentState(maxAvailable.toString())
						}}
						marginLeft
					/>
				</section>
			</div>
			<div className="availableOuter">{availableFundsJsx}</div>
		</InputWrapper>
	)
}
