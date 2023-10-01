// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type { U8aLike } from '@polkadot/util/types';
import type BigNumber from 'bignumber.js';
import type { Network, NetworkName } from '../../types';

export type ApiStatus = 'connecting' | 'connected' | 'disconnected';

export interface NetworkState {
  name: NetworkName;
  meta: Network;
}
export interface APIConstants {
  bondDuration: BigNumber;
  maxNominations: BigNumber;
  sessionsPerEra: BigNumber;
  maxNominatorRewardedPerValidator: BigNumber;
  historyDepth: BigNumber;
  maxElectingVoters: BigNumber;
  expectedBlockTime: BigNumber;
  epochDuration: BigNumber;
  existentialDeposit: BigNumber;
  fastUnstakeDeposit: BigNumber;
  poolsPalletId: U8aLike;
}

export type APIChainState =
  | {
      chain: string;
      version: string;
      ss58Prefix: number;
    }
  | undefined;

export interface APIContextInterface {
  api: ApiPromise | null;
  consts: APIConstants;
  chainState: APIChainState;
  isReady: boolean;
  apiStatus: ApiStatus;
  isLightClient: boolean;
  setIsLightClient: (isLightClient: boolean) => void;
}
