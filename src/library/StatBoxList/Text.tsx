// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp } from '@polkadot-cloud/react';
import { useHelp } from 'contexts/Help';
import { StatBox } from './Item';
import { TextTitleWrapper } from './Wrapper';
import type { TextProps } from './types';

export const Text = ({
  label,
  value,
  secondaryValue,
  helpKey,
  primary,
}: TextProps) => {
  const help = helpKey !== undefined;
  const { openHelp } = useHelp();
  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <TextTitleWrapper $primary={primary === true}>
            {value}
            {secondaryValue ? <span>{secondaryValue}</span> : null}
          </TextTitleWrapper>
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
