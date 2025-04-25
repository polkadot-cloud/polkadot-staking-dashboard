// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { bondedPool } from './bondedPool'
import { bondedPoolEntries } from './bondedPoolEntries'
import { erasStakersOverviewEntries } from './erasStakersOverviewEntries'
import { erasStakersPagedEntries } from './erasStakersPagedEntries'
import { erasValidatorRewardMulti } from './erasValidatorRewardMulti'
import { identityOfMulti } from './identityOfMulti'
import { nominatorsMulti } from './nominatorsMulti'
import { paraSessionAccounts } from './paraSessionAccounts'
import { poolMembersMulti } from './poolMembersMulti'
import { poolMetadataMulti } from './poolMetadataMulti'
import { proxies } from './proxies'
import { sessionValidators } from './sessionValidators'
import { superOfMulti } from './superOfMulti'
import { validatorEntries } from './validatorEntries'
import { validatorsMulti } from './validatorsMulti'

export const query = {
  bondedPool,
  bondedPoolEntries,
  erasStakersOverviewEntries,
  erasStakersPagedEntries,
  erasValidatorRewardMulti,
  identityOfMulti,
  nominatorsMulti,
  paraSessionAccounts,
  poolMembersMulti,
  poolMetadataMulti,
  proxies,
  sessionValidators,
  superOfMulti,
  validatorEntries,
  validatorsMulti,
}
