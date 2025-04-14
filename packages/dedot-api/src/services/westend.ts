// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import type { DedotClient } from 'dedot'

// TODO: start westend service apis

export const westendService = async (
  apiRelay: DedotClient<WestendApi>,
  apiPeople: DedotClient<WestendPeopleApi>
) => {
  // TODO: implement service logic
  console.debug(apiRelay, apiPeople)
}
