// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@polkadotcloud/core-ui';
import { useHelp } from 'contexts/Help';
import Odometer from 'react-odometerjs';
import { StatBox } from './Item';
import type { NumberProps } from './types';

export const Number = ({ label, value, unit, helpKey }: NumberProps) => {
  const help = helpKey !== undefined;
  const { openHelp } = useHelp();

  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <h3 className="text">
            <Odometer
              animation="count"
              duration={4500}
              value={value}
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
