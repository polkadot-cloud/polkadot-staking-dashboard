// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import useEraTimeLeft from 'library/Hooks/useEraTimeLeft';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { humanNumber } from 'Utils';

const ActiveEraStatBox = () => {
  const { t } = useTranslation('pages');
  const { metrics } = useNetworkMetrics();
  const { timeleft, fromNow, setFromNow } = useTimeLeft();
  const { activeEra } = metrics;
  const {
    timeleft: eraTimeLeft,
    percentSurpassed,
    percentRemaining,
  } = useEraTimeLeft();

  // re-set timer on era change (also covers network change).
  useEffect(() => {
    setFromNow(fromNow(eraTimeLeft));
  }, [activeEra]);

  const params = {
    label: t('overview.timeRemainingThisEra'),
    timeleft: timeleft.formatted,
    graph: {
      value1: activeEra.index === 0 ? 0 : percentSurpassed,
      value2: activeEra.index === 0 ? 100 : percentRemaining,
    },
    tooltip: `Era ${humanNumber(activeEra.index)}` ?? undefined,
    helpKey: 'Era',
  };
  return <Timeleft {...params} />;
};

export default ActiveEraStatBox;
