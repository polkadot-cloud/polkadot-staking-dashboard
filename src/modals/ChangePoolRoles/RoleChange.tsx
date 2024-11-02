// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn } from '@w3ux/utils';
import { Polkicon } from '@w3ux/react-polkicon';
import { RoleChangeWrapper } from './Wrapper';
import type { RoleChangeProps } from './types';

export const RoleChange = ({
  roleName,
  oldAddress,
  newAddress,
}: RoleChangeProps) => (
  <RoleChangeWrapper>
    <div className="label">{roleName}</div>
    <div className="role-change">
      <div className="input-wrap selected">
        <span style={{ fontSize: '2rem' }}>
          <Polkicon address={oldAddress ?? ''} />
        </span>
        <input
          className="input"
          disabled
          value={oldAddress ? ellipsisFn(oldAddress) : ''}
        />
      </div>
      <span>
        <FontAwesomeIcon icon={faAnglesRight} />
      </span>
      <div className="input-wrap selected">
        <span style={{ fontSize: '2rem' }}>
          <Polkicon address={newAddress ?? ''} />
        </span>
        <input
          className="input"
          disabled
          value={newAddress ? ellipsisFn(newAddress) : ''}
        />
      </div>
    </div>
  </RoleChangeWrapper>
);
