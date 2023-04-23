// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const SupportedProxies: { [key: string]: string[] | string } = {
  Any: '*',
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
  ],
};

export const isSupportedProxy = (proxy: string) =>
  Object.keys(SupportedProxies).includes(proxy) ||
  SupportedProxies[proxy] === '*';
