// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';

/*
 * Global Constants
 */
export const AppVersion = '1.0.3';
export const UriPrefix = '/';
export const TitleDefault = 'Polkadot Staking Dashboard';
export const DappName = 'Polkadot Staking Dashboard';
export const PolkadotUrl = 'https://polkadot.network/staking/';
export const DefaultNetwork = 'polkadot';

/*
 * Data Structure Helpers
 */
export const EmptyH256 = new Uint8Array(32);
export const ModPrefix = stringToU8a('modl');
export const U32Opts = { bitLength: 32, isLe: true };

export const PayeeStatus: Array<string> = ['Staked', 'Stash', 'Controller'];

export const InterfaceMaximumWidth = 1550;
export const SideMenuMaximisedWidth = 185;
export const SideMenuMinimisedWidth = 75;
export const SideMenuStickyThreshold = 1175;
export const SectionFullWidthThreshold = 1050;
export const ShowAccountsButtonWidthThreshold = 850;
export const FloatingMenuWidth = 250;
export const SmallFontSizeMaxWidth = 600;
export const MediumFontSizeMaxWidth = 1600;
export const TipsThresholdSmall = 750;
export const TipsThresholdMedium = 1200;

/*
 * Available plugins
 */
export const PluginsList = ['subscan', 'binance_spot', 'tips'];

/*
 * Fallback config values
 */
export const FallbackMaxNominations = 16;
export const FallbackBondingDuration = 28;
export const FallbackSessionsPerEra = 6;
export const FallbackNominatorRewardedPerValidator = 256;
export const FallbackMaxElectingVoters = 22500;
export const FallbackExpectedBlockTime = 6000;

/*
 * Misc values
 */
export const ListItemsPerPage = 50;
export const ListItemsPerBatch = 30;
export const MinBondPrecision = 3;
export const MaxPayoutDays = 60;

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
