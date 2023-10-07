// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { remToUnit } from '@polkadot-cloud/utils';
import { Polkicon } from '@polkadot-cloud/react';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import type { AccountDropdownProps } from '../../../library/Form/types';
import { StyledSelect } from './Wrappers';

export const Switch = ({ current, to }: AccountDropdownProps) => {
  const { getAccount } = useImportedAccounts();
  const toAccount = getAccount(to);

  return (
    <StyledSelect>
      <div>
        <div className="current">
          <div className="input-wrap selected">
            {toAccount !== null && (
              <Polkicon
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
              <Polkicon
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
