// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import LedgerFlexSVG from 'assets/brands/ledgerFlex.svg?react'
import LedgerNanoSVG from 'assets/brands/ledgerNano.svg?react'
import LedgerStaxSVG from 'assets/brands/ledgerStax.svg?react'
import type { FunctionComponent, SVGProps } from 'react'
import type { LedgerDeviceModel } from './deviceModel'

type SvgComponent = FunctionComponent<SVGProps<SVGSVGElement>>

/**
 * Returns the appropriate SVG icon component for a given Ledger device model.
 * Falls back to the generic Ledger logo for unknown devices.
 */
export const getLedgerDeviceIcon = (model: LedgerDeviceModel): SvgComponent => {
	switch (model) {
		case 'nano_s':
		case 'nano_x':
		case 'nano_s_plus':
			return LedgerNanoSVG
		case 'flex':
			return LedgerFlexSVG
		case 'stax':
			return LedgerStaxSVG
		default:
			return LedgerSquareSVG
	}
}
