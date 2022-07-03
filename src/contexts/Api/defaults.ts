// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';
import { APIConstants, ConnectionStatus } from 'types/api';
import BN from 'bn.js';
import { NetworkName } from 'types';
import { NODE_ENDPOINTS } from 'consts';

export const consts: APIConstants = {
  bondDuration: 0,
  maxNominations: 0,
  sessionsPerEra: 0,
  maxNominatorRewardedPerValidator: 0,
  maxElectingVoters: 0,
  expectedBlockTime: 0,
  existentialDeposit: new BN(0),
  poolsPalletId: stringToU8a('0'),
};

export const defaultApiContext = {
  // eslint-disable-next-line
  connect: async () : Promise<void> => {
    await new Promise((resolve) => resolve(null));
  },
  fetchDotPrice: () => {},
  // eslint-disable-next-line
  switchNetwork: async (_network: NetworkName) : Promise<void> => {
    await new Promise((resolve) => resolve(null));
  },
  api: null,
  consts,
  isReady: false,
  status: ConnectionStatus.Disconnected,
  network: NODE_ENDPOINTS.polkadot,
};
