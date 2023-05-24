// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@polkadotcloud/core-ui';
import { ReactOdometer } from '@polkadotcloud/react-odometer';
import { useHelp } from 'contexts/Help';
import { StatPie } from 'library/Graphs/StatBoxPie';
import { useEffect, useState } from 'react';
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
          <StatPie value={graph?.value1} value2={graph?.value2} />
          {tooltip ? (
            <div className="tooltip">
              <h3>{tooltip}</h3>
            </div>
          ) : null}
        </div>

        <div className="labels">
          <h3>
            <ReactOdometer duration={150} value={values.value} />
            {stat?.unit && <>{stat?.unit}</>}

            {showTotal ? (
              <span className="total">
                /&nbsp;
                <ReactOdometer duration={150} value={values.total} />
                {stat?.unit ? (
                  <>
                    &nbsp;
                    {stat?.unit}
                  </>
                ) : null}
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
