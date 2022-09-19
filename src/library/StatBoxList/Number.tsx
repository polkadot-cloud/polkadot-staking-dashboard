// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import NumberEasing from 'che-react-number-easing';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { StatBox } from './Item';
import { NumberProps } from './types';

export const Number = (props: NumberProps) => {
  const { label, value, unit, assistant } = props;
  const assist = assistant !== undefined;

  const currency = props.currency ?? '';

  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <h3 className="text">
            <NumberEasing
              ease="quintInOut"
              precision={2}
              speed={250}
              trail={false}
              value={value}
              useLocaleString
              currency={currency}
            />
            {unit && (
              <>
                &nbsp;
                {unit}
              </>
            )}
          </h3>
          <h4>
            {label}
            {assist && <OpenHelpIcon title={assistant} />}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
