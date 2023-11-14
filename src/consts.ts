// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { stringToU8a } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import type { Plugin } from 'types';

/*
 * Global Constants
 */
export const AppVersion = '1.1.2';
export const DappName = 'Polkadot Staking Dashboard';
export const PolkadotUrl = 'https://polkadot.network/features/staking/';
export const DefaultNetwork = 'polkadot';
export const ManualSigners = ['ledger', 'vault'];
/*
 * Data Structure Helpers
 */
export const EmptyH256 = new Uint8Array(32);
export const ModPrefix = stringToU8a('modl');
export const U32Opts = { bitLength: 32, isLe: true };

export const SideMenuMaximisedWidth = 185;
export const SideMenuMinimisedWidth = 75;
export const SideMenuStickyThreshold = 1150;
export const SectionFullWidthThreshold = 1000;
export const ShowAccountsButtonWidthThreshold = 825;
export const FloatingMenuWidth = 250;
export const SmallFontSizeMaxWidth = 600;
export const TipsThresholdSmall = 750;
export const TipsThresholdMedium = 1200;

/*
 * Available plugins
 */
export const PluginsList: Plugin[] = [
  'subscan',
  'binance_spot',
  'tips',
  'polkawatch',
];

/*
 * Fallback config values
 */
export const FallbackMaxNominations = new BigNumber(16);
export const FallbackBondingDuration = new BigNumber(28);
export const FallbackSessionsPerEra = new BigNumber(6);
export const FallbackNominatorRewardedPerValidator = new BigNumber(512);
export const FallbackMaxElectingVoters = new BigNumber(22500);
export const FallbackExpectedBlockTime = new BigNumber(6000);
export const FallbackEpochDuration = new BigNumber(2400);

/*
 * Misc values
 */
export const ListItemsPerPage = 25;
export const ListItemsPerBatch = 25;
export const MinBondPrecision = 3;
export const MaxPayoutDays = 60;
export const MaxEraRewardPointsEras = 14;

/*
 * Third party API keys and endpoints
 */
export const ApiSubscanKey = 'd37149339f64775155a82a53f4253b27';
export const EndpointPrice = 'https://api.binance.com/api/v3';
export const ApiEndpoints = {
  priceChange: `${EndpointPrice}/ticker/24hr?symbol=`,
  subscanRewardSlash: '/api/v2/scan/account/reward_slash',
  subscanPoolRewards: '/api/scan/nomination_pool/rewards',
  subscanEraStat: '/api/scan/staking/era_stat',
  subscanPoolMembers: '/api/scan/nomination_pool/pool/members',
  subscanPoolDetails: '/api/scan/nomination_pool/pool',
};

/*
 * default network parameters
 */
export const DefaultParams = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5,
};

/*
 * locale
 */
export const DefaultLocale = 'en';
