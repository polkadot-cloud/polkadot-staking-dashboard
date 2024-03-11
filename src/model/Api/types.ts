// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ConnectionType, EventStatus } from 'static/APIController/types';
import type { NetworkName } from 'types';

export interface APIConfig {
  type: ConnectionType;
  rpcEndpoint: string;
}

export interface APIEventDetail {
  // TODO: rename this to apiStatus.
  event: EventStatus;
  network: NetworkName;
  err?: string;
}
