// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useStaking } from '../../contexts/Staking';
import { useNetworkMetrics } from '../../contexts/Network';
import { useSessionEra } from '../../contexts/SessionEra';

export const useStats = () => {
  const { metrics } = useNetworkMetrics();
  const { staking, eraStakers }: any = useStaking();
  const { sessionEra } = useSessionEra();

  const { totalValidators, maxValidatorsCount, validatorCount } = staking;
  const { activeValidators } = eraStakers;

  // total validators as percent
  let totalValidatorsAsPercent = 0;
  if (maxValidatorsCount.gt(new BN(0))) {
    totalValidatorsAsPercent = totalValidators
      .div(maxValidatorsCount.div(new BN(100)))
      .toNumber();
  }

  // active validators as percent
  let activeValidatorsAsPercent = 0;
  if (validatorCount.gt(new BN(0))) {
    activeValidatorsAsPercent =
      activeValidators / (validatorCount.toNumber() * 0.01);
  }

  return [
    {
      format: 'chart-pie',
      params: {
        label: 'Total Validators',
        stat: {
          value: totalValidators.toNumber(),
          total: maxValidatorsCount.toNumber(),
          unit: '',
        },
        graph: {
          value1: totalValidators.toNumber(),
          value2: maxValidatorsCount.sub(totalValidators).toNumber(),
        },
        tooltip: `${totalValidatorsAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'validators',
          key: 'Validator',
        },
      },
    },
    {
      format: 'chart-pie',
      params: {
        label: 'Active Validators',
        stat: {
          value: activeValidators,
          total: validatorCount.toNumber(),
          unit: '',
        },
        graph: {
          value1: activeValidators,
          value2: validatorCount.sub(new BN(activeValidators)).toNumber(),
        },
        tooltip: `${activeValidatorsAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'validators',
          key: 'Active Validator',
        },
      },
    },
    {
      format: 'chart-pie',
      params: {
        label: 'Active Era',
        stat: {
          value: metrics.activeEra.index,
          unit: '',
        },
        graph: {
          value1: sessionEra.eraProgress,
          value2: sessionEra.eraLength - sessionEra.eraProgress,
        },
        assistant: {
          page: 'validators',
          key: 'Era',
        },
      },
    },
  ];
}