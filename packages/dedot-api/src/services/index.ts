// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { KusamaService } from './kusama'
import { PolkadotService } from './polkadot'
import { WestendService } from './westend'

export const Services = {
  polkadot: PolkadotService,
  kusama: KusamaService,
  westend: WestendService,
}
