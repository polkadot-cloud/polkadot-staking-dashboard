// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@rossbulat/polkadot-dashboard-ui';
import { useHelp } from 'contexts/Help';
import { Countdown } from 'library/Countdown';
import { StatPie } from 'library/Graphs/StatBoxPie';
import { StatBox } from './Item';
import { TimeleftProps } from './types';
import { TimeLeftWrapper } from './Wrapper';

export const Timeleft = ({
  label,
  timeleft,
  graph,
  tooltip,
  helpKey,
}: TimeleftProps) => {
  const help = helpKey !== undefined;
  const { openHelp } = useHelp();

  return (
    <StatBox>
      <div className="content chart">
        <div className="chart">
          <StatPie value={graph?.value1} value2={graph?.value2} />
          {tooltip ? (
            <div className="tooltip">
              <h3>{tooltip}</h3>
            </div>
          ) : null}
        </div>

        <div className="labels">
          <TimeLeftWrapper>
            <Countdown timeleft={timeleft} />
          </TimeLeftWrapper>
          <h4>
            {label}{' '}
            {help ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
