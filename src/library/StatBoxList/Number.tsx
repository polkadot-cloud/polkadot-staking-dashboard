// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@polkadotcloud/core-ui';
import { ReactOdometer } from '@polkadotcloud/react-odometer';
import { useHelp } from 'contexts/Help';
import { useEffect, useState } from 'react';
import { StatBox } from './Item';
import type { NumberProps } from './types';

export const Number = ({ label, value, unit, helpKey }: NumberProps) => {
  const help = helpKey !== undefined;
  const { openHelp } = useHelp();

  const [number, setNumber] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setNumber(value));
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value]);

  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <h3 className="text">
            <ReactOdometer duration={150} value={number} />
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
