// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { stringToU8a } from '@polkadot/util';

/*
 * Global Constants
 */
export const DappName = 'Polkadot Staking Dashboard';
export const ManualSigners = ['ledger', 'vault', 'wallet_connect'];

/*
 * Byte Helpers
 */
export const EmptyH256 = new Uint8Array(32);
export const ModPrefix = stringToU8a('modl');
export const U32Opts = { bitLength: 32, isLe: true };

/*
 * Element Thresholds
 */
export const MaxPageWidth = 1450;
export const SideMenuMaximisedWidth = 195;
export const SideMenuMinimisedWidth = 75;
export const SectionFullWidthThreshold = 1000;
export const PageWidthSmallThreshold = 825;
export const PageWidthMediumThreshold = 1150;
export const SmallFontSizeMaxWidth = 600;

export const TipsThresholdSmall = 750;
export const TipsThresholdMedium = 1200;

/*
 * Misc Values
 */
export const MaxPayoutDays = 60;
export const MaxEraRewardPointsEras = 10;
export const ZondaxMetadataHashApiUrl =
  'https://api.zondax.ch/polkadot/node/metadata/hash';
