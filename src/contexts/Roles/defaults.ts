// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RoleContextInterface } from './types';

export const defaultRoleContext: RoleContextInterface = {
  fetchAvailableReps: async () => [],
};
