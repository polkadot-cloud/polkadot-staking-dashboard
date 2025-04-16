// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { Service, ServiceType } from '.'

// Default service returns the service itself, along with relay & people chain apis
export type DefaultService<T extends keyof ServiceType> = {
  Service: ServiceType[T]
  apis: [DedotClient<Service[T][0]>, DedotClient<Service[T][1]>]
}
