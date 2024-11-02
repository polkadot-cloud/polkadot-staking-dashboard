// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn } from '@w3ux/utils';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { Polkicon } from '@w3ux/react-polkicon';
import { IdentityWrapper } from 'library/ListItem/Wrappers';
import { getIdentityDisplay } from '../../ValidatorList/ValidatorItem/Utils';
import type { IdentityProps } from '../types';

export const Identity = ({ address }: IdentityProps) => {
  const { validatorIdentities, validatorSupers, validatorsFetched } =
    useValidators();

  const [display, setDisplay] = useState<ReactNode>(
    getIdentityDisplay(validatorIdentities[address], validatorSupers[address])
  );

  useEffect(() => {
    setDisplay(
      getIdentityDisplay(validatorIdentities[address], validatorSupers[address])
    );
  }, [validatorSupers, validatorIdentities, address]);

  return (
    <IdentityWrapper
      className="identity"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span style={{ paddingRight: '0.25rem', fontSize: '2rem' }}>
        <Polkicon address={address} />
      </span>
      <div className="inner">
        {validatorsFetched && display !== null ? (
          <h4>{display}</h4>
        ) : (
          <h4>{ellipsisFn(address, 6)}</h4>
        )}
      </div>
    </IdentityWrapper>
  );
};
