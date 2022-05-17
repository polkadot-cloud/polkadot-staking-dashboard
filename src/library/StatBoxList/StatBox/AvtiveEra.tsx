// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from '../../../contexts/Network';
import { useSessionEra } from '../../../contexts/SessionEra';
import { Pie } from '../Pie';

const ActiveEraStatBox = () => {
  const { metrics } = useNetworkMetrics();
  const { sessionEra } = useSessionEra();
  const params = {
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
  };
  return <Pie {...params} />;
};

export default ActiveEraStatBox;
