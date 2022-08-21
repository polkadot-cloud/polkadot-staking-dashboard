// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useUi } from 'contexts/UI';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { useSize, formatSize } from 'library/Graphs/Utils';
import { StatusLabel } from 'library/StatusLabel';
import { useStaking } from 'contexts/Staking';

export const Payouts = () => {
  const { isSyncing, services } = useUi();
  const { inSetup } = useStaking();
  const notStaking = !isSyncing && inSetup();

  const ref = React.useRef<HTMLDivElement>(null);

  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 306);

  return (
    <div className="inner" ref={ref} style={{ minHeight }}>
      {!services.includes('subscan') ? (
        <StatusLabel
          status="active_service"
          statusFor="subscan"
          title="Subscan Disabled"
          topOffset="37%"
        />
      ) : (
        <StatusLabel
          status="sync_or_setup"
          title="Not Staking"
          topOffset="37%"
        />
      )}

      <div
        className="graph"
        style={{
          height: `${height}px`,
          width: `${width}px`,
          position: 'absolute',
          opacity: notStaking ? 0.75 : 1,
          transition: 'opacity 0.5s',
          marginTop: '1.5rem',
        }}
      >
        <PayoutBar days={19} height="200px" />
        <div style={{ marginTop: '2.5rem' }}>
          <PayoutLine days={19} average={10} height="80px" />
        </div>
      </div>
    </div>
  );
};

export default Payouts;
