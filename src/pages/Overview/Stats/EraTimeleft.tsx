// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { useSessionEra } from 'contexts/SessionEra';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { useEffect } from 'react';
import { humanNumber } from 'Utils';

const ActiveEraStatBox = () => {
  const { metrics } = useNetworkMetrics();
  const { sessionEra, getEraTimeLeft } = useSessionEra();
  const eraTimeLeft = getEraTimeLeft();
  const { timeleft, fromNow, setFromNow } = useTimeLeft();
  const { activeEra } = metrics;

  // set initial era time left
  useEffect(() => {
    setFromNow(fromNow(eraTimeLeft));
  }, [eraTimeLeft]);

  // re-set timer on era change
  useEffect(() => {
    setFromNow(fromNow(getEraTimeLeft()));
  }, [activeEra]);

  const params = {
    label: 'Time Remaining This Era',
    timeleft: timeleft.formatted,
    graph: {
      value1: sessionEra.eraProgress,
      value2: sessionEra.eraLength - sessionEra.eraProgress,
    },
    tooltip: `Era ${humanNumber(activeEra.index)}` ?? undefined,
    helpKey: 'Era',
  };
  return <Timeleft {...params} />;
};

export default ActiveEraStatBox;
