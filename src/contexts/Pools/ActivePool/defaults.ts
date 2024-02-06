// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { ActivePoolContextState } from './types';

export const nominationStatus = {};

export const defaultPoolRoles = {
  depositor: '',
  nominator: '',
  root: '',
  bouncer: '',
};

export const defaultPoolNominations = {
  targets: [],
  submittedIn: 0,
};

export const defaultActivePoolContext: ActivePoolContextState = {
  isBonding: () => false,
  isNominator: () => false,
  isOwner: () => false,
  isMember: () => false,
  isDepositor: () => false,
  isBouncer: () => false,
  getPoolBondedAccount: () => null,
  getPoolUnlocking: () => [],
  getPoolRoles: () => defaultPoolRoles,
  getNominationsStatus: () => nominationStatus,
  setActivePoolId: (p) => {},
  activePool: null,
  activePoolNominations: null,
  activePoolMemberCount: 0,
  pendingPoolRewards: new BigNumber(0),
};
