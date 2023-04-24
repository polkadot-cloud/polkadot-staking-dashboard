// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { remToUnit } from '@polkadotcloud/utils';
import { useConnect } from 'contexts/Connect';
import { Identicon } from 'library/Identicon';
import type { AccountDropdownProps } from '../../../library/Form/types';
import { StyledSelect } from './Wrappers';

export const Switch = ({ current, to }: AccountDropdownProps) => {
  const { getAccount } = useConnect();
  const toAccount = getAccount(to);

  return (
    <StyledSelect>
      <div>
        <div className="current">
          <div className="input-wrap selected">
            {toAccount !== null && (
              <Identicon
                value={current?.address ?? ''}
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
              <Identicon
                value={toAccount?.address ?? ''}
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
