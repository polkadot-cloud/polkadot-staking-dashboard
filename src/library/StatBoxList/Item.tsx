// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatBoxWrapper } from './Wrapper';
import NumberEasing from 'che-react-number-easing';
import { StatPie } from '../../library/Graphs/StatBoxPie';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

const PieStatBox = (props: any) => {
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
          <>
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
          </>
        </div>
      </div>
    </StatBox>
  );
};

const TextStatBox = (props: any) => {
  const { label, value, assistant } = props;

  let assist = assistant !== undefined;
  let page = assistant?.page ?? '';
  let key = assistant?.key ?? '';
  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <>
            <h1>{value}</h1>
            <h4>
              {label}
              {assist && <OpenAssistantIcon page={page} title={key} />}
            </h4>
          </>
        </div>
      </div>
    </StatBox>
  );
};

const NumberStatBox = (props: any) => {
  const { label, value, unit, assistant } = props;

  let assist = assistant !== undefined;
  let page = assistant?.page ?? '';
  let key = assistant?.key ?? '';

  let currency = props.currency ?? '';
  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
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
        </div>
      </div>
    </StatBox>
  );
};

const StatBox = ({ children }: any) => {
  return (
    <StatBoxWrapper
      whileHover={{ scale: 1.02 }}
      transition={{
        duration: 0.5,
        type: 'spring',
        bounce: 0.4,
      }}
    >
      {children}
    </StatBoxWrapper>
  );
};

const StatBoxListItem = ({ format, params }: any) => {
  switch (format) {
    case 'chart-pie':
      return <PieStatBox {...params} />;
    case 'number':
      return <NumberStatBox {...params} />;
    case 'text':
      return <TextStatBox {...params} />;
    default:
      return null;
  }
};

export default StatBoxListItem;
