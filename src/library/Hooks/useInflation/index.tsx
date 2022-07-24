// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import BN from 'bn.js';

export const useInflation = () => {
  const { network } = useApi();
  const { metrics } = useNetworkMetrics();
  const { staking } = useStaking();
  const { params } = network;
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

  const BN_MILLION = new BN('1000000');

  const calculateInflation = (totalStaked: BN, numAuctions: BN): number => {
    const stakedFraction =
      totalStaked.isZero() || totalIssuance.isZero()
        ? 0
        : totalStaked.mul(BN_MILLION).div(totalIssuance).toNumber() /
          BN_MILLION.toNumber();
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

    return inflation;
  };

  return calculateInflation(lastTotalStake, auctionCounter);
};

export default useInflation;
