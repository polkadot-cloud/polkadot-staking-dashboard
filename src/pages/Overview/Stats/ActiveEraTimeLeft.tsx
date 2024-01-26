// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { fromUnixTime } from 'date-fns';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEraTimeLeft } from 'library/Hooks/useEraTimeLeft';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { fromNow } from 'library/Hooks/useTimeLeft/utils';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { useApi } from 'contexts/Api';

export const ActiveEraStat = () => {
  const { t } = useTranslation('pages');
  const { activeEra } = useApi();
  const { get: getEraTimeleft } = useEraTimeLeft();
  const { timeleft, setFromNow } = useTimeLeft();

  const dateFrom = fromUnixTime(Date.now() / 1000);
  const dateTo = fromNow(getEraTimeleft().timeleft.toNumber());

  // re-set timer on era change (also covers network change).
  useEffect(() => {
    setFromNow(dateFrom, dateTo);
  }, [activeEra]);

  // NOTE: this maybe should be called in an interval. Needs more testing.
  const { percentSurpassed, percentRemaining } = getEraTimeleft();

  const params = {
    label: t('overview.timeRemainingThisEra'),
    timeleft: timeleft.formatted,
    graph: {
      value1: activeEra.index.isZero() ? 0 : percentSurpassed.toNumber(),
      value2: activeEra.index.isZero() ? 100 : percentRemaining.toNumber(),
    },
    tooltip: `Era ${new BigNumber(activeEra.index).toFormat()}` ?? undefined,
    helpKey: 'Era',
  };
  return <Timeleft {...params} />;
};
