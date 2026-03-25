// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import LedgerFlexWebP from 'assets/brands/ledgerFlex.webp'
import LedgerNanoWebP from 'assets/brands/ledgerNano.webp'
import LedgerStaxWebP from 'assets/brands/ledgerStax.webp'
import type { ComponentType, FunctionComponent, ImgHTMLAttributes } from 'react'
import { createElement } from 'react'
import type { LedgerDeviceModel } from './deviceModel'

type LedgerDeviceIconComponent = ComponentType
type ImageComponent = FunctionComponent<ImgHTMLAttributes<HTMLImageElement>>

const createLedgerDeviceImage = (src: string, alt: string): ImageComponent => {
	const LedgerDeviceImage: ImageComponent = ({ alt: _alt, ...props }) =>
		createElement('img', { alt, src, ...props })

	return LedgerDeviceImage
}

const LedgerNanoImage = createLedgerDeviceImage(LedgerNanoWebP, 'Ledger Nano')
const LedgerFlexImage = createLedgerDeviceImage(LedgerFlexWebP, 'Ledger Flex')
const LedgerStaxImage = createLedgerDeviceImage(LedgerStaxWebP, 'Ledger Stax')

/**
 * Returns the appropriate image component for a given Ledger device model.
 * Falls back to the generic Ledger logo for unknown devices.
 */
export const getLedgerDeviceIcon = (
	model: LedgerDeviceModel,
): LedgerDeviceIconComponent => {
	switch (model) {
		case 'nano_s':
		case 'nano_x':
		case 'nano_s_plus':
			return LedgerNanoImage
		case 'flex':
			return LedgerFlexImage
		case 'stax':
			return LedgerStaxImage
		default:
			return LedgerSquareSVG
	}
}
