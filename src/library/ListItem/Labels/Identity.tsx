// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { clipAddress } from '@polkadot-cloud/utils';
import { useEffect, useState } from 'react';
import { useValidators } from 'contexts/Validators';
import { Identicon } from 'library/Identicon';
import { IdentityWrapper } from 'library/ListItem/Wrappers';
import { getIdentityDisplay } from '../../ValidatorList/Validator/Utils';
import type { IdentityProps } from '../types';

export const Identity = ({ address, batchKey }: IdentityProps) => {
  const { meta, validatorIdentities, validatorSupers } = useValidators();

  const stake = meta[batchKey]?.stake ?? [];

  const [display, setDisplay] = useState(
    getIdentityDisplay(validatorIdentities[address], validatorSupers[address])
  );

  // aggregate synced status
  const identitiesSynced =
    Object.values(validatorIdentities).length > 0 ?? false;

  const supersSynced = Object.values(validatorSupers).length > 0 ?? false;

  const synced = {
    identities: identitiesSynced && supersSynced,
    stake: stake.length > 0 ?? false,
  };

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
      <Identicon value={address} size={24} />
      <div className="inner">
        {synced.identities && display !== null ? (
          <h4>{display}</h4>
        ) : (
          <h4>{clipAddress(address)}</h4>
        )}
      </div>
    </IdentityWrapper>
  );
};
