// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { useSessionEra } from 'contexts/SessionEra';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { useEffect } from 'react';

const ActiveEraStatBox = () => {
  const { metrics } = useNetworkMetrics();
  const { sessionEra } = useSessionEra();
  const { getEraTimeLeft } = useSessionEra();

  const eraTimeLeft = getEraTimeLeft();

  const { timeleft, fromNow, setFromNow } = useTimeLeft(eraTimeLeft);

  useEffect(() => {
    setFromNow(fromNow(eraTimeLeft));
  }, [eraTimeLeft]);

  const params = {
    label: 'Time Remaining This Era',
    timeleft: timeleft.formatted,
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
