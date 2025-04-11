// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export const SupportedProxies: Record<string, string[]> = {
  Any: ['*'],
  Staking: [
    'Staking.bond',
    'Staking.bond_extra',
    'Staking.chill',
    'Staking.nominate',
    'Staking.rebond',
    'Staking.set_controller',
    'Staking.set_payee',
    'Staking.unbond',
    'Staking.withdraw_unbonded',
    'NominationPools.create',
    'NominationPools.nominate',
    'NominationPools.bond_extra',
    'NominationPools.chill',
    'NominationPools.claim_payout',
    'NominationPools.join',
    'NominationPools.set_claim_permission',
    'NominationPools.claim_commission',
    'NominationPools.set_commission',
    'NominationPools.set_commission_max',
    'NominationPools.set_commission_change_rate',
    'NominationPools.unbond',
    'NominationPools.set_metadata',
    'NominationPools.set_state',
    'NominationPools.withdraw_unbonded',
    'FastUnstake.register_fast_unstake',
    'FastUnstake.deregister',
  ],
}

export const UnsupportedIfUniqueController: string[] = [
  'Staking.chill',
  'Staking.nominate',
  'Staking.rebond',
  'Staking.unbond',
  'Staking.set_payee',
  'Staking.withdraw_unbonded',
]
