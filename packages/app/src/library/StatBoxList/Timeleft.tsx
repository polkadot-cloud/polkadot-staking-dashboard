// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help';
import { Countdown } from 'library/Countdown';
import { StatBox } from './Item';
import { TimeLeftWrapper } from './Wrapper';
import type { TimeleftProps } from './types';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { SimplePie } from 'library/SimplePie';

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
          <SimplePie
            items={[
              {
                value: graph?.value1,
                color: 'var(--accent-color-primary)',
              },
              {
                value: graph?.value2,
                color: 'var(--background-default)',
              },
            ]}
            diameter={34}
          />
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
