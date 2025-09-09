// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { registerSaEvent } from './util'

// TODO: (refactor): Clear on `main` and add to `gh-deploy`

// Handle a conversion event based on a utm source
export const onConversionEvent = (utmSource: string) => {
	registerSaEvent(`conversion_${utmSource}`)
}

// Record a new user event
export const onNewUserEvent = (attributes: Record<string, unknown> = {}) => {
	registerSaEvent('new_user', attributes)
}

// Record a returning user event
export const onReturningUserEvent = (
	attributes: Record<string, unknown> = {},
) => {
	registerSaEvent('returning_user', attributes)
}
