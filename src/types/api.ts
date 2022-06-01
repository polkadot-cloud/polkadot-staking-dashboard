// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { U8aLike } from '@polkadot/util/types';
import BN from 'bn.js';
import { NodeEndpoint, NetworkName } from '.';

export enum ConnectionStatus {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface NetworkState {
  name: NetworkName;
  meta: NodeEndpoint;
}
export interface APIConstants {
  bondDuration: number;
  maxNominations: number;
  sessionsPerEra: number;
  maxNominatorRewardedPerValidator: number;
  maxElectingVoters: number;
  expectedBlockTime: number;
  existentialDeposit: BN;
  poolsPalletId: U8aLike;
}

export interface APIContextInterface {
  connect: (_network: NetworkName) => Promise<void>;
  fetchDotPrice: () => void;
  switchNetwork: (_network: NetworkName) => Promise<void>;
  api: ApiPromise | null;
  consts: APIConstants;
  isReady: boolean;
  status: ConnectionStatus;
  network: NodeEndpoint;
}
