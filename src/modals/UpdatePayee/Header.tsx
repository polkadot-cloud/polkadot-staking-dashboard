// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HeaderWrapper } from './Wrappers';

export const Header = ({ current, selected }: any) => {
  return (
    <HeaderWrapper>
      <div>
        <h4>{current ?? ''}</h4>
      </div>
      <span>
        <FontAwesomeIcon icon={faAnglesRight} />
      </span>
      <div>
        <h4>{selected || ''}</h4>
      </div>
    </HeaderWrapper>
  );
};
