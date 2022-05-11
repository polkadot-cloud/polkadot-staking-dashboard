// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatBoxWrapper } from './Wrapper';
import NumberEasing from 'che-react-number-easing';
import { StatBoxPie } from '../../library/Graphs/StatBoxPie';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

export const Item = (props: any) => {

  const { label, value, value2, total, unit, format, tooltip, assistant } = props;

  let assist = assistant !== undefined;
  let page = assistant?.page ?? '';
  let key = assistant?.key ?? '';

  let currency = props.currency ?? '';

  let showValue = !(value === 0 && total !== 0);
  let showTotal = !(total === undefined || !total);

  return (
    <StatBoxWrapper
      whileHover={{ scale: 1.02 }}
      transition={{
        duration: 0.5,
        type: "spring",
        bounce: 0.4,
      }}
    >
      <div className='content chart'>
        {(format === 'chart-pie' || format === 'chart-bar') &&
          <div className='chart'>
            {format === 'chart-pie' && <StatBoxPie value={value} value2={value2} />}
            {tooltip &&
              <div className='tooltip'>
                <p>{tooltip}</p>
              </div>
            }
          </div>
        }
        <div className='labels'>
          {format === 'number' &&
            <>
              <h2>
                <NumberEasing
                  ease="quintInOut"
                  precision={2}
                  speed={250}
                  trail={false}
                  value={value}
                  useLocaleString={true}
                  currency={currency}
                />
                {unit && <>&nbsp;{unit}</>}
              </h2>
              <h4>
                {label}
                {assist && <OpenAssistantIcon page={page} title={key} />}
              </h4>
            </>
          }
          {format === 'text' &&
            <>
              <h1>{value}</h1>
              <h4>
                {label}
                {assist && <OpenAssistantIcon page={page} title={key} />}
              </h4>
            </>
          }
          {(format === 'chart-pie' || format === 'chart-bar') &&
            <>
              <h2>
                {showValue
                  ?
                  <>
                    <NumberEasing
                      ease="quintInOut"
                      precision={2}
                      speed={250}
                      trail={false}
                      value={value}
                      useLocaleString={true}
                    />{unit && <>&nbsp;{unit}</>}

                    {showTotal &&
                      <span className='total'>
                        / <NumberEasing
                          ease="quintInOut"
                          precision={2}
                          speed={250}
                          trail={false}
                          value={total}
                          useLocaleString={true}
                        />{unit && <>&nbsp;{unit}</>}
                      </span>
                    }
                  </>
                  : <>0</>
                }
              </h2>
              <h4>
                {label}
                {assist && <OpenAssistantIcon page={page} title={key} />}
              </h4>
            </>
          }
        </div>
      </div>
    </StatBoxWrapper>
  )
}

export default Item;