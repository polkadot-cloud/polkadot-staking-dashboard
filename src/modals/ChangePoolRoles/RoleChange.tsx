// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clipAddress, remToUnit } from '@polkadot-cloud/utils';
import { PolkadotIcon } from '@polkadot-cloud/react';
import { useTheme } from 'contexts/Themes';
import { RoleChangeWrapper } from './Wrapper';

export const RoleChange = ({ roleName, oldAddress, newAddress }: any) => {
  const { mode } = useTheme();
  return (
    <RoleChangeWrapper>
      <div className="label">{roleName}</div>
      <div className="role-change">
        <div className="input-wrap selected">
          <PolkadotIcon
            dark={mode === 'dark'}
            nocopy
            address={oldAddress ?? ''}
            size={remToUnit('2rem')}
          />
          <input
            className="input"
            disabled
            value={oldAddress ? clipAddress(oldAddress) : ''}
          />
        </div>
        <span>
          <FontAwesomeIcon icon={faAnglesRight} />
        </span>
        <div className="input-wrap selected">
          <PolkadotIcon
            dark={mode === 'dark'}
            nocopy
            address={newAddress ?? ''}
            size={remToUnit('2rem')}
          />
          <input
            className="input"
            disabled
            value={newAddress ? clipAddress(newAddress) : ''}
          />
        </div>
      </div>
    </RoleChangeWrapper>
  );
};
