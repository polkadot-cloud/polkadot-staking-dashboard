// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { useSessionEra } from 'contexts/SessionEra';
import { useEraTimeLeft } from 'library/Hooks/useEraTimeLeft';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';

const ActiveEraStatBox = () => {
  const { metrics } = useNetworkMetrics();
  const { sessionEra } = useSessionEra();
  const eraTimeLeft = useEraTimeLeft();
  const { t } = useTranslation('pages');

  const timeleft = new Date(1000 * eraTimeLeft).toISOString().substring(11, 19);

  const params = {
    label: t('overview.activeEra'),
    stat: {
      value: metrics.activeEra.index,
      unit: '',
    },
    graph: {
      value1: sessionEra.eraProgress,
      value2: sessionEra.eraLength - sessionEra.eraProgress,
    },
    tooltip: metrics.activeEra.index === 0 ? undefined : timeleft,
    helpKey: 'Era',
  };
  return <Pie {...params} />;
};

export default ActiveEraStatBox;
