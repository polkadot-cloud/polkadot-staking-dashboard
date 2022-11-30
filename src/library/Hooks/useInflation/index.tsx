// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN_BILLION, BN_MILLION, BN_THOUSAND } from '@polkadot/util';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';

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
    yearlyInflationInTokens,
  } = params;

  /* For Aleph Zero inflation is calculated based on yearlyInflationInTokens and totalIssuanceInTokens
   * We multiply stakedReturn by 0.9, as in case of Aleph Zero chain 10% of return goes to treasury
   */
  const calculateInflation = (totalStaked: BN, numAuctions: BN) => {
    const stakedFraction =
      totalStaked.isZero() || totalIssuance.isZero()
        ? 0
        : totalStaked.mul(BN_MILLION).div(totalIssuance).toNumber() /
          BN_MILLION.toNumber();
    const idealStake =
      stakeTarget -
      Math.min(auctionMax, numAuctions.toNumber()) * auctionAdjust;
    const idealInterest = maxInflation / idealStake;

    const totalIssuanceInTokens = totalIssuance
      .div(BN_BILLION)
      .div(BN_THOUSAND);

    const inflation = totalIssuanceInTokens.isZero()
      ? 0
      : 100 * (yearlyInflationInTokens / totalIssuanceInTokens.toNumber());

    let stakedReturn = stakedFraction ? inflation / stakedFraction : 0;
    stakedReturn *= 0.9;

    return {
      idealInterest,
      idealStake,
      inflation,
      stakedFraction,
      stakedReturn,
    };
  };

  return calculateInflation(lastTotalStake, auctionCounter);
};

export default useInflation;
