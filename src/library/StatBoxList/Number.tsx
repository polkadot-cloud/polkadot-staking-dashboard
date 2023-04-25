// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@polkadotcloud/core-ui';
import { useHelp } from 'contexts/Help';
import { useEffect, useState } from 'react';
import Odometer from 'react-odometerjs';
import { StatBox } from './Item';
import type { NumberProps } from './types';

export const Number = ({ label, value, unit, helpKey }: NumberProps) => {
  const help = helpKey !== undefined;
  const { openHelp } = useHelp();

  const [number, setNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => setNumber(value));
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <h3 className="text">
            <Odometer
              animation="count"
              duration={2500}
              value={number}
              style={{ cursor: 'pointer' }}
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
