// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SupportedCurrencies } from 'consts/currencies'
import { useCurrency } from 'contexts/Currency'
import { ButtonModal } from 'ui-buttons'
import { ButtonList, Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const SelectCurrency = () => {
	const { closeModal } = useOverlay().modal
	const { currency, setCurrency } = useCurrency()
	const currencies = Object.keys(SupportedCurrencies).sort()

	return (
		<>
			<Close />
			<Padding>
				<Title>Select Currency</Title>
				<ButtonList forceHeight>
					{currencies.map((code) => (
						<ButtonModal
							key={code}
							selected={code === currency}
							text={code}
							label={SupportedCurrencies[code].symbol}
							onClick={() => {
								setCurrency(code)
								closeModal()
							}}
						/>
					))}
				</ButtonList>
			</Padding>
		</>
	)
}
