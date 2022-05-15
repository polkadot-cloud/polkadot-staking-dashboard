// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from '../../contexts/Staking';
import { useApi } from '../../contexts/Api';
import { useNetworkMetrics } from '../../contexts/Network';

export const useStats = () => {
  const { network, consts }: any = useApi();
  const { units } = network;
  const { maxElectingVoters } = consts;
  const { metrics }: any = useNetworkMetrics();
  const { totalIssuance } = metrics;
  const { staking, eraStakers }: any = useStaking();

  const { totalNominators, maxNominatorsCount, lastTotalStake } = staking;

  const { activeNominators } = eraStakers;

  // total supply as percent
  let supplyAsPercent = 0;
  if (totalIssuance.gt(new BN(0))) {
    supplyAsPercent = lastTotalStake
      .div(totalIssuance.div(new BN(100)))
      .toNumber();
  }

  // total active nominators as percent
  let totalNominatorsAsPercent = 0;
  if (maxNominatorsCount.gt(new BN(0))) {
    totalNominatorsAsPercent = totalNominators
      .div(maxNominatorsCount.div(new BN(100)))
      .toNumber();
  }

  // active nominators as percent
  let activeNominatorsAsPercent = 0;
  if (maxElectingVoters > 0) {
    activeNominatorsAsPercent =
      activeNominators / new BN(maxElectingVoters).div(new BN(100)).toNumber();
  }

  // base values
  let lastTotalStakeBase = lastTotalStake.div(new BN(10 ** units));
  let totalIssuanceBase = totalIssuance.div(new BN(10 ** units));

  return [
    {
      format: 'chart-pie',
      params: {
        label: 'Supply Staked',
        stat: {
          value: lastTotalStakeBase.toNumber(),
          unit: network.unit,
        },
        graph: {
          value1: lastTotalStakeBase.toNumber(),
          value2: totalIssuanceBase.sub(lastTotalStakeBase).toNumber(),
        },

        tooltip: `${supplyAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'overview',
          key: 'Supply Staked',
        },
      },
    },
    {
      format: 'chart-pie',
      params: {
        label: 'Total Nominators',
        stat: {
          value: totalNominators.toNumber(),
          total: maxNominatorsCount,
          unit: '',
        },
        graph: {
          value1: totalNominators.toNumber(),
          value2: maxNominatorsCount.sub(totalNominators).toNumber(),
        },

        tooltip: `${totalNominatorsAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'overview',
          key: 'Nominators',
        },
      },
    },
    {
      format: 'chart-pie',
      params: {
        label: 'Active Nominators',
        stat: {
          value: activeNominators,
          total: maxElectingVoters,
          unit: '',
        },
        graph: {
          value1: activeNominators,
          value2: maxElectingVoters - activeNominators,
        },
        tooltip: `${activeNominatorsAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'overview',
          key: 'Active Nominators',
        },
      },
    },
  ];
}