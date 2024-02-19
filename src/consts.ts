// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { stringToU8a } from '@polkadot/util';
import type { Plugin } from 'types';

/*
 * Global Constants
 */
export const AppVersion = '1.1.5';
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

/*
 * Element Structure Variables
 */
export const SideMenuMaximisedWidth = 185;
export const SideMenuMinimisedWidth = 75;
export const SideMenuStickyThreshold = 1150;
export const SectionFullWidthThreshold = 1000;
export const PageWidthSmallThreshold = 825;
export const SmallFontSizeMaxWidth = 600;

export const TipsThresholdSmall = 750;
export const TipsThresholdMedium = 1200;

/*
 * Available Plugins
 */
export const PluginsList: Plugin[] = [
  'subscan',
  'binance_spot',
  'tips',
  'polkawatch',
];

/*
 * Misc Values
 */
export const MinBondPrecision = 3;
export const MaxPayoutDays = 60;
export const MaxEraRewardPointsEras = 14;

/*
 * Third Party API Keys and Endpoints
 */
export const EndpointPrice = 'https://api.binance.com/api/v3';
export const ApiEndpoints = {
  priceChange: `${EndpointPrice}/ticker/24hr?symbol=`,
};

/*
 * Default Network Parameters
 */
export const DefaultParams = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5,
};
