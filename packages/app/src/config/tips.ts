// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

interface TipConfig {
  id: string;
  s: number;
  page?: string;
}

export const TipsConfig: TipConfig[] = [
  {
    id: 'connectExtensions',
    s: 1,
  },
  {
    id: 'recommendedNominator',
    s: 2,
    page: 'nominate',
  },
  {
    id: 'recommendedJoinPool',
    s: 3,
    page: 'pools',
  },
  {
    id: 'howToStake',
    s: 4,
  },
  {
    id: 'managingNominations',
    s: 5,
    page: 'nominate',
  },
  {
    id: 'monitoringPool',
    s: 6,
    page: 'pools',
  },
  {
    id: 'joinAnotherPool',
    s: 6,
    page: 'pools',
  },
  {
    id: 'keepPoolNominating',
    s: 7,
    page: 'pools',
  },
  {
    id: 'reviewingPayouts',
    s: 8,
    page: 'payouts',
  },
  {
    id: 'understandingValidatorPerformance',
    s: 8,
    page: 'validators',
  },
];
