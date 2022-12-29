// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatPie } from 'library/Graphs/StatBoxPie';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { StatBox } from './Item';
import { TimeleftProps } from './types';
import { TineleftWrapper } from './Wrapper';

export const Timeleft = (props: TimeleftProps) => {
  const { label, timeleft, graph, tooltip, helpKey } = props;
  const help = helpKey !== undefined;

  // TODO: replace hard-coded tineleft with dynamic from `timeleft`.
  return (
    <StatBox>
      <div className="content chart">
        <div className="chart">
          <StatPie value={graph?.value1} value2={graph?.value2} />
          {tooltip && (
            <div className="tooltip">
              <h3>{tooltip}</h3>
            </div>
          )}
        </div>

        <div className="labels">
          <TineleftWrapper>
            21 <span>hrs</span> 41 <span>mins</span>
            {/* 20 <span>mins</span> : 41 
            41 <span>seconds</span> */}
          </TineleftWrapper>
          <h4>
            {label} {help && <OpenHelpIcon helpKey={helpKey} />}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
