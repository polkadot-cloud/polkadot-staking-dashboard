// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@polkadotcloud/dashboard-ui';
import NumberEasing from 'che-react-number-easing';
import { useHelp } from 'contexts/Help';
import { StatBox } from './Item';
import type { NumberProps } from './types';

export const Number = ({
  label,
  value,
  unit,
  helpKey,
  currency = '',
}: NumberProps) => {
  const help = helpKey !== undefined;
  const { openHelp } = useHelp();

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
            {unit ? (
              <>
                &nbsp;
                {unit}
              </>
            ) : null}
          </h3>
          <h4>
            {label}
            {help ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
