// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { MaybeAccount } from 'types';
import { ActivePoolContextState } from '../types';

export const nominationStatus = {};

export const defaultActivePoolContext: ActivePoolContextState = {
  isBonding: () => false,
  isNominator: () => false,
  isOwner: () => false,
  isDepositor: () => false,
  getPoolBondedAccount: () => null,
  // eslint-disable-next-line
  getPoolBondOptions: (a: MaybeAccount) => null,
  getPoolUnlocking: () => [],
  // eslint-disable-next-line
  setTargets: (t) => {},
  getNominationsStatus: () => nominationStatus,
  activeBondedPool: {},
  targets: [],
  poolNominations: [],
};

export const targets = {
  nominations: [],
};

export const nominations = {
  targets: [],
  submittedIn: 0,
};

export const poolBondOptions = {
  active: new BN(0),
  freeToBond: new BN(0),
  freeToUnbond: new BN(0),
  totalUnlocking: new BN(0),
  totalUnlocked: new BN(0),
  totalPossibleBond: new BN(0),
  totalUnlockChuncks: 0,
};
