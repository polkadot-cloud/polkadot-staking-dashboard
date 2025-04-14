// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaApi } from '@dedot/chaintypes'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { DedotClient } from 'dedot'

// TODO: start kusama service apis

export const kusamaService = async (
  apiRelay: DedotClient<KusamaApi>,
  apiPeople: DedotClient<KusamaPeopleApi>
) => {
  // TODO: implement service logic
  console.debug(apiRelay, apiPeople)
}
