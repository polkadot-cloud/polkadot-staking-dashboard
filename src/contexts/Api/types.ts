// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { U8aLike } from '@polkadot/util/types';
import BN from 'bn.js';
import { Network, NetworkName } from '../../types';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export interface NetworkState {
  name: NetworkName;
  meta: Network;
}
export interface APIConstants {
  bondDuration: number;
  maxNominations: number;
  sessionsPerEra: number;
  maxNominatorRewardedPerValidator: number;
  historyDepth: BN;
  maxElectingVoters: number;
  expectedBlockTime: number;
  epochDuration: number;
  existentialDeposit: BN;
  poolsPalletId: U8aLike;
}

export interface APIContextInterface {
  connect: (_network: NetworkName) => Promise<void>;
  fetchDotPrice: () => void;
  switchNetwork: (
    _network: NetworkName,
    _isLightClient: boolean
  ) => Promise<void>;
  api: ApiPromise | null;
  consts: APIConstants;
  isReady: boolean;
  isLightClient: boolean;
  status: ConnectionStatus;
  network: Network;
}
