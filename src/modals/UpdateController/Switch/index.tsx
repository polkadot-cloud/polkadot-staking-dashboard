// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { remToUnit } from '@polkadot-cloud/utils';
import { useConnect } from 'contexts/Connect';
import { PolkadotIcon } from '@polkadot-cloud/react';
import { useTheme } from 'contexts/Themes';
import type { AccountDropdownProps } from '../../../library/Form/types';
import { StyledSelect } from './Wrappers';

export const Switch = ({ current, to }: AccountDropdownProps) => {
  const { getAccount } = useConnect();
  const toAccount = getAccount(to);
  const { mode } = useTheme();

  return (
    <StyledSelect>
      <div>
        <div className="current">
          <div className="input-wrap selected">
            {toAccount !== null && (
              <PolkadotIcon
                dark={mode === 'dark'}
                nocopy
                address={current?.address ?? ''}
                size={remToUnit('2rem')}
              />
            )}
            <input className="input" disabled value={current?.name ?? ''} />
          </div>
          <span>
            <FontAwesomeIcon icon={faAnglesRight} />
          </span>

          <div className="input-wrap selected">
            {current?.active ? (
              <PolkadotIcon
                dark={mode === 'dark'}
                nocopy
                address={toAccount?.address ?? ''}
                size={remToUnit('2rem')}
              />
            ) : undefined}
            <input
              className="input"
              disabled
              value={toAccount?.address ? toAccount?.name : '...'}
            />
          </div>
        </div>
      </div>
    </StyledSelect>
  );
};
