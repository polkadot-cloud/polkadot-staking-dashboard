// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { Polkicon } from '@polkadot-cloud/react';
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
      <Polkicon address={address} size="2rem" />
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
