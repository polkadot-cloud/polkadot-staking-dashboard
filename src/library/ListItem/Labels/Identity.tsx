// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { Identicon } from 'library/Identicon';
import { IdentityWrapper } from 'library/ListItem/Wrappers';
import { useEffect, useState } from 'react';
import { clipAddress } from 'Utils';
import { getIdentityDisplay } from '../../ValidatorList/Validator/Utils';
import type { IdentityProps } from '../types';

export const Identity = ({ address, batchKey, batchIndex }: IdentityProps) => {
  const { meta } = useValidators();

  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];
  const stake = meta[batchKey]?.stake ?? [];

  const [display, setDisplay] = useState(
    getIdentityDisplay(identities[batchIndex], supers[batchIndex])
  );
  // aggregate synced status
  const identitiesSynced = identities.length > 0 ?? false;
  const supersSynced = supers.length > 0 ?? false;

  const synced = {
    identities: identitiesSynced && supersSynced,
    stake: stake.length > 0 ?? false,
  };

  useEffect(() => {
    setDisplay(getIdentityDisplay(identities[batchIndex], supers[batchIndex]));
  }, [meta, address]);

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
