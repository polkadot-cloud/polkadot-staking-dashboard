// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp, Odometer } from '@polkadot-cloud/react';
import { useHelp } from 'contexts/Help';
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
            <Odometer value={value.toFixed(decimals)} />
            {unit ? (
              <>
                <span style={{ paddingLeft: '0.2rem' }} />
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
