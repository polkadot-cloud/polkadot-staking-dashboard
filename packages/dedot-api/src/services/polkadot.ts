// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { DedotClient } from 'dedot'

export const polkadotService = async (
  apiRelay: DedotClient<PolkadotApi>,
  apiPeople: DedotClient<PolkadotPeopleApi>
) => {
  // TODO: implement service logic
  console.debug(apiRelay, apiPeople)
}
