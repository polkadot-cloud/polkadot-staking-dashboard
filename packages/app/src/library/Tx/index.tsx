// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { Signer } from './Signer'
import type { TxProps } from './types'
import { Wrapper } from './Wrapper'

/**
 * @name Tx
 * @summary A wrapper to handle transaction submission.
 */
export const Tx = (props: TxProps) => {
	const {
		margin,
		notEnoughFunds,
		dangerMessage,
		SignerComponent,
		displayFor = 'default',
		transparent,
	} = props

	const innerClasses = classNames('inner', {
		[displayFor]: ['canvas', 'card'].includes(displayFor),
		transparent: !!transparent,
	})

	return (
		<Wrapper className={margin ? 'margin' : undefined}>
			<div className={innerClasses}>
				<Signer
					{...props}
					dangerMessage={dangerMessage}
					notEnoughFunds={notEnoughFunds}
				/>
				<section>{SignerComponent}</section>
			</div>
		</Wrapper>
	)
}
