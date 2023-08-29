// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp, Odometer } from '@polkadot-cloud/react';
import { useHelp } from 'contexts/Help';
import BigNumber from 'bignumber.js';
import { minDecimalPlaces } from '@polkadot-cloud/utils';
import { StatBox } from './Item';
import type { NumberProps } from './types';

export const Number = ({
  label,
  value,
  unit,
  helpKey,
  decimals,
}: NumberProps) => {
  const help = helpKey !== undefined;
  const { openHelp } = useHelp();

  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <h3>
            <Odometer
              value={minDecimalPlaces(
                new BigNumber(value).decimalPlaces(decimals || 0).toFormat(),
                2
              )}
            />
            {unit ? <>{unit}</> : null}
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
