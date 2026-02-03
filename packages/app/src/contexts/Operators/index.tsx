// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { shuffle } from '@w3ux/utils'
import type {
	ValidatorEntry,
	ValidatorSupportedNetwork,
} from '@w3ux/validator-assets'
import {
	ValidatorCommunity,
	validatorListSupported,
} from '@w3ux/validator-assets'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { OperatorsContextInterface } from './types'

export const [OperatorsContext, useOperators] =
	createSafeContext<OperatorsContextInterface>()

export const OperatorsProvider = ({ children }: { children: ReactNode }) => {
	// Stores a randomised validator operators dataset
	const [validatorOperators] = useState<ValidatorEntry[]>([
		...shuffle(ValidatorCommunity),
	])

	// Get operators for a network
	const getNetworkOperators = (network: string) => {
		if (!validatorListSupported(network)) {
			return []
		}
		return validatorOperators.filter(
			(v) => v.validators[network as ValidatorSupportedNetwork] !== undefined,
		)
	}

	return (
		<OperatorsContext.Provider
			value={{ validatorOperators, getNetworkOperators }}
		>
			{children}
		</OperatorsContext.Provider>
	)
}
