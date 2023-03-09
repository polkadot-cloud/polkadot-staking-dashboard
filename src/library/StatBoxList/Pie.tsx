// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@rossbulat/polkadot-dashboard-ui';
import NumberEasing from 'che-react-number-easing';
import { useHelp } from 'contexts/Help';
import { StatPie } from 'library/Graphs/StatBoxPie';
import { StatBox } from './Item';
import type { PieProps } from './types';

export const Pie = ({ label, stat, graph, tooltip, helpKey }: PieProps) => {
  const help = helpKey !== undefined;
  const showValue = stat?.value !== 0 || stat?.total === 0;
  const showTotal = !!stat?.total;
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
          <h3>
            {showValue ? (
              <>
                <NumberEasing
                  ease="quintInOut"
                  precision={2}
                  speed={250}
                  trail={false}
                  value={Number(stat?.value ?? 0)}
                  useLocaleString
                />
                {stat?.unit && <>{stat?.unit}</>}

                {showTotal ? (
                  <span className="total">
                    /{' '}
                    <NumberEasing
                      ease="quintInOut"
                      precision={2}
                      speed={250}
                      trail={false}
                      value={Number(stat?.total ?? 0)}
                      useLocaleString
                    />
                    {stat?.unit ? (
                      <>
                        &nbsp;
                        {stat?.unit}
                      </>
                    ) : null}
                  </span>
                ) : null}
              </>
            ) : (
              <>0</>
            )}
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
