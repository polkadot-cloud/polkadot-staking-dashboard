// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { useNetwork } from 'contexts/Network';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useStaking } from 'contexts/Staking';

export const useInflation = () => {
  const {
    networkData: { params },
  } = useNetwork();
  const { metrics } = useNetworkMetrics();
  const { staking } = useStaking();
  const { lastTotalStake } = staking;
  const { totalIssuance, auctionCounter } = metrics;

  const {
    auctionAdjust,
    auctionMax,
    falloff,
    maxInflation,
    minInflation,
    stakeTarget,
  } = params;

  const BIGNUMBER_MILLION = new BigNumber(1_000_000);

  const calculateInflation = (
    totalStaked: BigNumber,
    numAuctions: BigNumber
  ) => {
    const stakedFraction =
      totalStaked.isZero() || totalIssuance.isZero()
        ? 0
        : totalStaked
            .multipliedBy(BIGNUMBER_MILLION)
            .dividedBy(totalIssuance)
            .toNumber() / BIGNUMBER_MILLION.toNumber();
    const idealStake =
      stakeTarget -
      Math.min(auctionMax, numAuctions.toNumber()) * auctionAdjust;
    const idealInterest = maxInflation / idealStake;
    const inflation =
      100 *
      (minInflation +
        (stakedFraction <= idealStake
          ? stakedFraction * (idealInterest - minInflation / idealStake)
          : (idealInterest * idealStake - minInflation) *
            2 ** ((idealStake - stakedFraction) / falloff)));

    return {
      idealInterest,
      idealStake,
      inflation,
      stakedFraction,
      stakedReturn: stakedFraction ? inflation / stakedFraction : 0,
    };
  };

  return calculateInflation(lastTotalStake, auctionCounter);
};
