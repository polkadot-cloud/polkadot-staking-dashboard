// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { WellKnownChain } from '@substrate/connect';
import { DefaultParams } from 'consts';
import VaraIconSVG from 'img/vara_icon.svg?react';
import VaraInlineSVG from 'img/vara_inline.svg?react';
import VaraTokenSVG from 'img/vara_token.svg?react';
import VaraLogoSVG from 'img/logo-vara-black.svg?react';

import type { NetworkName, Networks } from 'types';
import BigNumber from 'bignumber.js';

// DEPRECATION: Paged Rewards
//
// Temporary until paged rewards migration has completed on all networks.
export const NetworksWithPagedRewards: NetworkName[] = ['westend'];
export const PagedRewardsStartEra: Record<NetworkName, BigNumber | null> = {
  vara: null,
  polkadot: null,
  kusama: null,
  westend: new BigNumber(7167),
};

export const NetworkList: Networks = {
  vara: {
    name: 'vara',
    endpoints: {
      lightClient: WellKnownChain.polkadot,
      defaultRpcEndpoint: 'Parity',
      rpcEndpoints: {
        Parity: 'wss://rpc.vara.network',
      },
    },
    namespace: 'fe1b4c55fd4d668101126434206571a7',
    colors: {
      primary: {
        light: 'rgb(127, 255, 225)',
        dark: 'rgba(14,211,163,0.8)',
      },
      secondary: {
        light: 'rgb(127, 255, 225)',
        dark: 'rgb(127, 255, 225)',
      },
      stroke: {
        light: 'rgb(127, 255, 225)',
        dark: 'rgb(127, 255, 225)',
      },
      transparent: {
        light: 'rgb(127, 255, 225)',
        dark: 'rgb(127, 255, 225)',
      },
      pending: {
        light: 'rgb(127, 255, 225)',
        dark: 'rgb(127, 255, 225)',
      },
    },
    subscanEndpoint: 'https://vara.api.subscan.io',
    unit: 'VARA',
    units: 12,
    ss58: 137,
    brand: {
      icon: VaraIconSVG,
      token: VaraTokenSVG,
      logo: {
        svg: VaraLogoSVG,
        width: '5.1em',
      },
      inline: {
        svg: VaraInlineSVG,
        size: '0.96em',
      },
    },
    api: {
      unit: 'VARA',
      priceTicker: 'VARAUSDT',
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.75,
    },
    defaultFeeReserve: 0.1,
    maxExposurePageSize: new BigNumber(512),
  },
};
