// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { fromUnixTime, getUnixTime } from 'date-fns';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEraTimeLeft } from 'hooks/useEraTimeLeft';
import { useTimeLeft } from '@w3ux/hooks';
import { secondsFromNow } from '@w3ux/hooks/util';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { useApi } from 'contexts/Api';
import { formatTimeleft } from 'library/Utils';
import { useNetwork } from 'contexts/Network';

export const ActiveEraStat = () => {
  const { t, i18n } = useTranslation('pages');
  const { activeEra } = useApi();
  const { network } = useNetwork();
  const { get: getEraTimeleft } = useEraTimeLeft();

  const { percentSurpassed, percentRemaining } = getEraTimeleft();

  const { timeleft, setFromNow } = useTimeLeft({
    depsTimeleft: [network],
    depsFormat: [i18n.resolvedLanguage],
  });

  const timeleftResult = getEraTimeleft();
  const dateFrom = fromUnixTime(Date.now() / 1000);
  const formatted = formatTimeleft(t, timeleft.raw);
  const dateTo = secondsFromNow(timeleftResult.timeleft.toNumber());
  const dateToUnix = getUnixTime(dateTo);

  // re-set timer on era change (also covers network change).
  useEffect(() => {
    setFromNow(dateFrom, dateTo);
  }, [activeEra, dateToUnix]);

  const params = {
    label: t('overview.timeRemainingThisEra'),
    timeleft: formatted,
    graph: {
      value1: activeEra.index.isZero() ? 0 : percentSurpassed.toNumber(),
      value2: activeEra.index.isZero() ? 100 : percentRemaining.toNumber(),
    },
    tooltip: `Era ${new BigNumber(activeEra.index).toFormat()}`,
    helpKey: 'Era',
  };
  return <Timeleft {...params} />;
};
