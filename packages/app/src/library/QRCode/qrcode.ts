// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import _qrcode from 'qrcode-generator'

// A small hurdle to jump through, just to get the default/default correct (as generated)
const qrcode: typeof _qrcode = _qrcode

// HACK The default function take string -> number[], the Uint8array is compatible
// with that signature and the use thereof
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(qrcode as any).stringToBytes = (data: Uint8Array): Uint8Array => data

export { qrcode }
