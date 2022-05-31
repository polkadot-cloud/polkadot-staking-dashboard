// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moment from 'moment';
import { useNetworkMetrics } from 'contexts/Network';
import { useSessionEra } from 'contexts/SessionEra';
import { useEraTimeLeft } from 'library/Hooks/useEraTimeLeft';
import { Pie } from 'library/StatBoxList/Pie';

const ActiveEraStatBox = () => {
  const { metrics } = useNetworkMetrics();
  const { sessionEra } = useSessionEra();
  const eraTimeLeft = useEraTimeLeft();

  // format era time left
  const _timeleft = moment.duration(eraTimeLeft * 1000, 'milliseconds');
  const timeleft = `${_timeleft.hours()}:${_timeleft.minutes()}:${_timeleft.seconds()}`;

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
    tooltip: timeleft,
    assistant: {
      page: 'validators',
      key: 'Era',
    },
  };
  return <Pie {...params} />;
};

export default ActiveEraStatBox;
