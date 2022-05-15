// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatBox } from './Item';
import NumberEasing from 'che-react-number-easing';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

export const Number = (props: any) => {

  const { label, value, unit, assistant } = props;

  let assist = assistant !== undefined;
  let page = assistant?.page ?? '';
  let key = assistant?.key ?? '';

  let currency = props.currency ?? '';

  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
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
        </div>
      </div>
    </StatBox>
  );
};
