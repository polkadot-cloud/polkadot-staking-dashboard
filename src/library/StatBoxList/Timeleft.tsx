// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Countdown } from 'library/Countdown';
import { StatPie } from 'library/Graphs/StatBoxPie';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { StatBox } from './Item';
import { TimeleftProps } from './types';
import { TimeLeftWrapper } from './Wrapper';

export const Timeleft = (props: TimeleftProps) => {
  const { label, timeleft, graph, tooltip, helpKey } = props;
  const help = helpKey !== undefined;

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
          <TimeLeftWrapper>
            <Countdown timeleft={timeleft} />
          </TimeLeftWrapper>
          <h4>
            {label} {help && <OpenHelpIcon helpKey={helpKey} />}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
