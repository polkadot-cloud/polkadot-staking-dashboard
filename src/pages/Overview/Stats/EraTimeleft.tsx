// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { useSessionEra } from 'contexts/SessionEra';
import { useEraTimeLeft } from 'library/Hooks/useEraTimeLeft';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { Timeleft } from 'library/StatBoxList/Timeleft';
import { useEffect, useState } from 'react';

const ActiveEraStatBox = () => {
  const { metrics } = useNetworkMetrics();
  const { sessionEra } = useSessionEra();
  const eraTimeLeft = useEraTimeLeft();
  const {
    timeleft: { formatted: timeleft },
    setTo,
    fromNow,
  } = useTimeLeft(eraTimeLeft);

  // store local `eraTimeLeft` to determine when new era starts.
  const [localEraTimeLeft, setLocalEraTimeLeft] = useState(eraTimeLeft);

  // reset timeleft when finished era resets.
  useEffect(() => {
    if (eraTimeLeft === 0) {
      setLocalEraTimeLeft(0);
    }
    if (localEraTimeLeft === 0 && eraTimeLeft > 0) {
      setLocalEraTimeLeft(eraTimeLeft);
      setTo(fromNow(eraTimeLeft));
    }
  }, [eraTimeLeft]);

  const params = {
    label: 'Time Remaining This Era',
    timeleft,
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
