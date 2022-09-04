// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { clipAddress } from 'Utils';
import Identicon from 'library/Identicon';
import { IdentityWrapper } from 'library/ListItem/Wrappers';
import { getIdentityDisplay } from '../../ValidatorList/Validator/Utils';
import { IdentityProps } from '../types';

export const ValidatorIdentity = (props: IdentityProps) => {
  const { meta } = useValidators();
  const { address, batchKey, batchIndex } = props;
  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];
  const stake = meta[batchKey]?.stake ?? [];

  // aggregate synced status
  const identitiesSynced = identities.length > 0 ?? false;
  const supersSynced = supers.length > 0 ?? false;

  const synced = {
    identities: identitiesSynced && supersSynced,
    stake: stake.length > 0 ?? false,
  };

  const display = getIdentityDisplay(
    identities[batchIndex],
    supers[batchIndex]
  );

  return (
    <IdentityWrapper
      className="identity"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Identicon value={address} size={26} />
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
