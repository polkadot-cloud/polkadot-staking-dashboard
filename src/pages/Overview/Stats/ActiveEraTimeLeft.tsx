// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { fromUnixTime } from 'date-fns';
import { useEraTimeLeft } from 'library/Hooks/useEraTimeLeft';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { fromNow } from 'library/Hooks/useTimeLeft/utils';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const ActiveEraStat = () => {
  const { t } = useTranslation('pages');
  const { apiStatus } = useApi();
  const { activeEra } = useNetworkMetrics();
  const { get: getEraTimeleft } = useEraTimeLeft();
  const { timeleft, setFromNow } = useTimeLeft();

  const dateFrom = fromUnixTime(Date.now() / 1000);
  const dateTo = fromNow(getEraTimeleft().timeleft.toNumber());

  // re-set timer on era change (also covers network change).
  useEffect(() => {
    setFromNow(dateFrom, dateTo);
  }, [apiStatus, activeEra]);

  // NOTE: this maybe should be called in an interval. Needs more testing.
  const { percentSurpassed, percentRemaining } = getEraTimeleft();

  const params = {
    label: t('overview.timeRemainingThisEra'),
    timeleft: timeleft.formatted,
    graph: {
      value1: activeEra.isPlaceholder ? 0 : percentSurpassed.toNumber(),
      value2: activeEra.isPlaceholder ? 100 : percentRemaining.toNumber(),
    },
    tooltip: `Era ${new BigNumber(activeEra.index).toFormat()}` ?? undefined,
    helpKey: 'Era',
  };
  return <Timeleft {...params} />;
};
