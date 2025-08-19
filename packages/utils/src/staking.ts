// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NominationStatus } from 'types'

// Utility to get the nominees of a provided nomination status
export const filterNomineesByStatus = (
	nominees: [string, NominationStatus][],
	status: string,
) => nominees.map(([k, v]) => (v === status ? k : false)).filter((v) => !!v)
