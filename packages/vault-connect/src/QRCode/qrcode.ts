// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import _qrcode from 'qrcode-generator'

const qrcode: typeof _qrcode = _qrcode

;(qrcode as any).stringToBytes = (data: Uint8Array): Uint8Array => data

export { qrcode }
