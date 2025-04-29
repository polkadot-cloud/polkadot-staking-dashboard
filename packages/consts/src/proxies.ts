// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export const SupportedProxies: Record<string, string[]> = {
  Any: ['*'],
  Staking: [
    'Staking.Bond',
    'Staking.BondExtra',
    'Staking.Chill',
    'Staking.Nominate',
    'Staking.Rebond',
    'Staking.SetController',
    'Staking.SetPayee',
    'Staking.Unbond',
    'Staking.WithdrawUnbonded',
    'NominationPools.Create',
    'NominationPools.Nominate',
    'NominationPools.BondExtra',
    'NominationPools.Chill',
    'NominationPools.ClaimPayout',
    'NominationPools.Join',
    'NominationPools.SetClaimPermission',
    'NominationPools.ClaimCommission',
    'NominationPools.SetCommission',
    'NominationPools.SetCommissionMax',
    'NominationPools.SetCommissionChangeRate',
    'NominationPools.Unbond',
    'NominationPools.SetMetadata',
    'NominationPools.SetState',
    'NominationPoolsWithdrawUnbonded',
    'FastUnstake.RegisterFastUnstake',
    'FastUnstake.Deregister',
  ],
}

export const UnsupportedIfUniqueController: string[] = [
  'Staking.Chill',
  'Staking.Nominate',
  'Staking.Rebond',
  'Staking.Unbond',
  'Staking.SetPayee',
  'Staking.WithdrawUnbonded',
]
