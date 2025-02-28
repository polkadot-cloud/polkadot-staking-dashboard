// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Odometer } from '@w3ux/react-odometer';
import { useHelp } from 'contexts/Help';
import BigNumber from 'bignumber.js';
import { StatBox } from './Item';
import type { NumberProps } from './types';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';

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
              value={new BigNumber(value)
                .decimalPlaces(decimals || 0)
                .toFormat()}
            />
            {unit || null}
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
