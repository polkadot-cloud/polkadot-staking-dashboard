// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, remToUnit } from '@polkadot-cloud/utils';
import { Polkicon } from '@polkadot-cloud/react';
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
        <Polkicon address={oldAddress ?? ''} size={remToUnit('2rem')} />
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
        <Polkicon address={newAddress ?? ''} size={remToUnit('2rem')} />
        <input
          className="input"
          disabled
          value={newAddress ? ellipsisFn(newAddress) : ''}
        />
      </div>
    </div>
  </RoleChangeWrapper>
);
