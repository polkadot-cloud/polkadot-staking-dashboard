// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export const SupportedProxies: Record<string, string[]> = {
  Any: ['*'],
  Staking: [
    'staking.bond',
    'staking.bondExtra',
    'staking.chill',
    'staking.nominate',
    'staking.rebond',
    'staking.setController',
    'staking.setPayee',
    'staking.unbond',
    'staking.withdrawUnbonded',
    'nominationPools.create',
    'nominationPools.nominate',
    'nominationPools.bondExtra',
    'nominationPools.chill',
    'nominationPools.claimPayout',
    'nominationPools.join',
    'nominationPools.setClaimPermission',
    'nominationPools.claimCommission',
    'nominationPools.setCommission',
    'nominationPools.setCommissionMax',
    'nominationPools.setCommissionChangeRate',
    'nominationPools.unbond',
    'nominationPools.setMetadata',
    'nominationPools.setState',
    'nominationPools.withdrawUnbonded',
    'fastUnstake.registerFastUnstake',
    'fastUnstake.deregister',
  ],
};

export const UnsupportedIfUniqueController: string[] = [
  'staking.chill',
  'staking.nominate',
  'staking.rebond',
  'staking.unbond',
  'staking.setPayee',
  'staking.withdrawUnbonded',
];

export const isSupportedProxy = (proxy: string) =>
  Object.keys(SupportedProxies).includes(proxy) || proxy === 'Any';

export const isSupportedProxyCall = (
  proxy: string,
  pallet: string,
  method: string
) => {
  if ([method, pallet].includes('undefined')) {
    return false;
  }

  const call = `${pallet}.${method}`;
  const calls = SupportedProxies[proxy];
  return (calls || []).find((c) => ['*', call].includes(c)) !== undefined;
};
