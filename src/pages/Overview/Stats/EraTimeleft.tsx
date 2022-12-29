// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { useSessionEra } from 'contexts/SessionEra';
import { intervalToDuration } from 'date-fns';
import { useEraTimeLeft } from 'library/Hooks/useEraTimeLeft';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { RawTimeleft } from 'library/StatBoxList/types';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ActiveEraStatBox = () => {
  const { metrics } = useNetworkMetrics();
  const { sessionEra } = useSessionEra();
  const eraTimeLeft = useEraTimeLeft();
  const { t } = useTranslation();

  const [value, setValue] = useState<RawTimeleft>([]);

  // format the interval of era time left.
  // TODO: remove `str`, for testing purposes only.
  /*
 TODO: move to useTimeleft hook.
 const timeleft = useTimeleft(start, end);
 
 timeleft: {
    formatted: [
      [0, days],
      [23, hrs],
      [12, mins]
      [20]
    ]
    raw: {
      days: 0
      hours: 0
      minutes: 0
      seconds: 0
    }
  }
  */
  const timeleft = useMemo(() => {
    const end = new Date();
    end.setSeconds(end.getSeconds() + eraTimeLeft);
    const interval = intervalToDuration({
      start: Date.now(),
      end,
    });

    const days = interval?.days || 0;
    const hours = interval?.hours || 0;
    const minutes = interval?.minutes || 0;
    const seconds = interval?.seconds || 0;

    // let str = '';
    const strArray = [];
    strArray.push([days, t('time.day', { count: days, ns: 'base' })]);
    if (days > 0) {
      // str += `${days} ${t('time.day', { count: days, ns: 'base' })} `;
    }

    strArray.push([hours, t('time.hr', { count: hours, ns: 'base' })]);
    // str += `${hours} ${t('time.hr', { count: hours, ns: 'base' })} `;

    strArray.push([minutes, t('time.min', { count: minutes, ns: 'base' })]);
    // str += `${minutes} ${t('time.min', { count: minutes, ns: 'base' })}`;

    if (days === 0 && hours === 0) {
      strArray.push([seconds, '']);
      // str += ` ${seconds}`;
    }
    return strArray;
  }, [eraTimeLeft]);

  useEffect(() => {
    setValue(timeleft);
  }, [timeleft]);

  const params = {
    label: 'Time Remaining This Era',
    timeleft: value,
    graph: {
      value1: sessionEra.eraProgress,
      value2: sessionEra.eraLength - sessionEra.eraProgress,
    },
    tooltip: `Era ${metrics.activeEra.index}` ?? undefined,
    helpKey: 'Era',
  };
  return <Timeleft {...params} />;
};

export default ActiveEraStatBox;
