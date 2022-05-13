// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatBox } from './Item';
import NumberEasing from 'che-react-number-easing';
import { StatPie } from '../../library/Graphs/StatBoxPie';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

export const Pie = (props: any) => {

  const { label, value, value2, total, unit, tooltip, assistant } = props;
  let assist = assistant !== undefined;
  let page = assistant?.page ?? '';
  let key = assistant?.key ?? '';

  let showValue = !(value === 0 && total !== 0);
  let showTotal = !(total === undefined || !total);
  return (
    <StatBox>
      <div className="content chart">
        <div className="chart">
          <StatPie value={value} value2={value2} />
          {tooltip && (
            <div className="tooltip">
              <p>{tooltip}</p>
            </div>
          )}
        </div>

        <div className="labels">
          <h2>
            {showValue ? (
              <>
                <NumberEasing
                  ease="quintInOut"
                  precision={2}
                  speed={250}
                  trail={false}
                  value={value}
                  useLocaleString={true}
                />
                {unit && <>&nbsp;{unit}</>}

                {showTotal && (
                  <span className="total">
                    /{' '}
                    <NumberEasing
                      ease="quintInOut"
                      precision={2}
                      speed={250}
                      trail={false}
                      value={total}
                      useLocaleString={true}
                    />
                    {unit && <>&nbsp;{unit}</>}
                  </span>
                )}
              </>
            ) : (
              <>0</>
            )}
          </h2>
          <h4>
            {label}
            {assist && <OpenAssistantIcon page={page} title={key} />}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
