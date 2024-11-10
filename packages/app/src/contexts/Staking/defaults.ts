// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type {
  EraStakers,
  NominationStatuses,
  StakingContextInterface,
} from 'contexts/Staking/types';

export const defaultEraStakers: EraStakers = {
  activeAccountOwnStake: [],
  activeValidators: 0,
  stakers: [],
  totalActiveNominators: 0,
};

export const defaultNominationStatus: NominationStatuses = {};

export const defaultStakingContext: StakingContextInterface = {
  fetchEraStakers: async (e) => new Promise((resolve) => resolve([])),
  getNominationsStatusFromTargets: (w, t) => defaultNominationStatus,
  getControllerNotImported: (a) => false,
  addressDifferentToStash: (a) => false,
  isBonding: () => false,
  isNominating: () => false,
  inSetup: () => true,
  eraStakers: defaultEraStakers,
  getPagedErasStakers: (e) => new Promise((resolve) => resolve([])),
};
