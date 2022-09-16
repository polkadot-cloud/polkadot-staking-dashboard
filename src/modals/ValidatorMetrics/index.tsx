// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useSubscan } from 'contexts/Subscan';
import { EraPoints as EraPointsGraph } from 'library/Graphs/EraPoints';
import { SubscanButton } from 'library/SubscanButton';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { useSize, formatSize } from 'library/Graphs/Utils';
import Identicon from 'library/Identicon';
import { clipAddress } from 'Utils';
import { useNetworkMetrics } from 'contexts/Network';
import { StatusLabel } from 'library/StatusLabel';
import { Title } from 'library/Modal/Title';

export const ValidatorMetrics = () => {
  const { config } = useModal();
  const { address, identity } = config;
  const { fetchEraPoints }: any = useSubscan();
  const { metrics } = useNetworkMetrics();

  const [list, setList] = useState([]);

  const ref: any = React.useRef();
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 300);

  const handleEraPoints = async () => {
    const _list = await fetchEraPoints(address, metrics.activeEra.index);
    setList(_list);
  };

  useEffect(() => {
    handleEraPoints();
  }, []);

  return (
    <>
      <Title title="Validator Metrics" />
      <div className="header">
        <Identicon value={address} size={33} />
        <h2>
          &nbsp;&nbsp;
          {identity === null ? clipAddress(address) : identity}
        </h2>
      </div>
      <div className="body" style={{ position: 'relative' }}>
        <SubscanButton />
        <GraphWrapper
          style={{
            margin: '0 0.5rem',
            height: 275,
            border: 'none',
            boxShadow: 'none',
          }}
          flex
        >
          <h4>Recent Era Points</h4>
          <div className="inner" ref={ref} style={{ minHeight }}>
            <StatusLabel
              status="active_service"
              statusFor="subscan"
              title="Subscan Disabled"
            />
            <div
              className="graph"
              style={{
                height: `${height}px`,
                width: `${width}px`,
                position: 'absolute',
                left: '-1rem',
              }}
            >
              <EraPointsGraph items={list} height={200} />
            </div>
          </div>
        </GraphWrapper>
      </div>
    </>
  );
};

export default ValidatorMetrics;
