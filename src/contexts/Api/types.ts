// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { U8aLike } from '@polkadot/util/types';
import BigNumber from 'bignumber.js';
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
  historyDepth: BigNumber;
  maxElectingVoters: number;
  expectedBlockTime: number;
  epochDuration: number;
  existentialDeposit: BigNumber;
  fastUnstakeDeposit: BigNumber;
  poolsPalletId: U8aLike;
}

export interface APIContextInterface {
  connect: (n: NetworkName) => Promise<void>;
  switchNetwork: (n: NetworkName, l: boolean) => Promise<void>;
  api: ApiPromise | null;
  consts: APIConstants;
  isReady: boolean;
  isLightClient: boolean;
  status: ConnectionStatus;
  network: Network;
}
