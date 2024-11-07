// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { fromUnixTime } from 'date-fns';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEraTimeLeft } from 'hooks/useEraTimeLeft';
import { useTimeLeft } from 'hooks/useTimeLeft';
import { fromNow } from 'hooks/useTimeLeft/utils';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { useApi } from 'contexts/Api';

export const ActiveEraStat = () => {
  const { t } = useTranslation('pages');
  const { activeEra } = useApi();
  const { get: getEraTimeleft } = useEraTimeLeft();
  const { timeleft, setFromNow } = useTimeLeft();

  const timeleftResult = getEraTimeleft();
  const dateFrom = fromUnixTime(Date.now() / 1000);
  const dateTo = fromNow(timeleftResult.timeleft.toNumber());

  // re-set timer on era change (also covers network change).
  useEffect(() => {
    setFromNow(dateFrom, dateTo);
  }, [activeEra, timeleftResult.end.toString()]);

  // NOTE: this maybe should be called in an interval. Needs more testing.
  const { percentSurpassed, percentRemaining } = timeleftResult;

  const params = {
    label: t('overview.timeRemainingThisEra'),
    timeleft: timeleft.formatted,
    graph: {
      value1: activeEra.index.isZero() ? 0 : percentSurpassed.toNumber(),
      value2: activeEra.index.isZero() ? 100 : percentRemaining.toNumber(),
    },
    tooltip: `Era ${new BigNumber(activeEra.index).toFormat()}`,
    helpKey: 'Era',
  };
  return <Timeleft {...params} />;
};
