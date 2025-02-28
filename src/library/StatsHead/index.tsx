// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp, ButtonTertiary } from '@polkadot-cloud/react';
import { useHelp } from 'contexts/Help';
import { Wrapper } from './Wrapper';
import type { StatsHeadProps } from './types';

export const StatsHead = ({ items }: StatsHeadProps) => {
  const { openHelp } = useHelp();

  return (
    <Wrapper>
      {items.map(({ label, value, button, helpKey }, i) => (
        <div key={`head_stat_${i}`}>
          <div className="inner">
            <h2>
              {value}
              {button && (
                <ButtonTertiary
                  text={button.text}
                  onClick={() => button.onClick()}
                  disabled={button.disabled}
                />
              )}
            </h2>
            <h4>
              {label}
              {!!helpKey && (
                <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
              )}
            </h4>
          </div>
        </div>
      ))}
    </Wrapper>
  );
};
