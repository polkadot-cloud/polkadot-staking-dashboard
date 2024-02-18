// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help';
import { HeaderWrapper } from './Wrappers';
import type { HeaderProps } from './types';
import { ButtonHelp } from 'library/Buttons/ButtonHelp';
import { ButtonTertiary } from 'library/Buttons/ButtonTertiary';

export const Header = ({ items }: HeaderProps) => {
  const { openHelp } = useHelp();

  return (
    <HeaderWrapper>
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
    </HeaderWrapper>
  );
};
