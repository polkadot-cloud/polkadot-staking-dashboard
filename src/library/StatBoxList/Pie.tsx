// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp, Chart, Odometer } from '@polkadot-cloud/react';
import { useEffect, useState } from 'react';
import { useHelp } from 'contexts/Help';
import BigNumber from 'bignumber.js';
import { StatBox } from './Item';
import type { PieProps } from './types';

export const Pie = ({ label, stat, graph, tooltip, helpKey }: PieProps) => {
  const help = helpKey !== undefined;
  const showTotal = !!stat?.total;
  const { openHelp } = useHelp();

  const [values, setValues] = useState<any>({
    value: Number(stat?.value || 0),
    total: Number(stat?.total || 0),
  });

  useEffect(() => {
    setValues({
      value: Number(stat?.value || 0),
      total: Number(stat?.total || 0),
    });
  }, [stat]);

  return (
    <StatBox>
      <div className="content chart">
        <div className="chart">
          <Chart
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
            speed={2}
          />
          {tooltip ? (
            <div className="tooltip">
              <h3>{tooltip}</h3>
            </div>
          ) : null}
        </div>

        <div className="labels">
          <h3>
            <Odometer value={new BigNumber(values.value).toFormat()} />
            {stat?.unit && <>{stat?.unit}</>}

            {showTotal ? (
              <span className="total">
                /&nbsp;
                <Odometer value={new BigNumber(values.total).toFormat()} />
                {stat?.unit ? <>{stat?.unit}unit</> : null}
              </span>
            ) : null}
          </h3>
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
