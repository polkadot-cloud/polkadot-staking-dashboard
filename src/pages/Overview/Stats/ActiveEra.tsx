// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { useSessionEra } from 'contexts/SessionEra';
import { format, fromUnixTime } from 'date-fns';
import { useEraTimeLeft } from 'library/Hooks/useEraTimeLeft';
import { Pie } from 'library/StatBoxList/Pie';
import { locales } from 'locale';
import { useTranslation } from 'react-i18next';

const ActiveEraStatBox = () => {
  const { metrics } = useNetworkMetrics();
  const { sessionEra } = useSessionEra();
  const eraTimeLeft = useEraTimeLeft();
  const { i18n, t } = useTranslation('pages');

  const _timeleft = fromUnixTime(eraTimeLeft);
  const timeleft = format(_timeleft, 'kk:mm:ss', {
    locale: locales[i18n.resolvedLanguage],
  });

  const params = {
    label: t('overview.active_era'),
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
