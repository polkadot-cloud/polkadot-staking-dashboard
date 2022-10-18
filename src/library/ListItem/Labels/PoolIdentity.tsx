// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useBondedPools } from 'contexts/Pools/BondedPools';
import Identicon from 'library/Identicon';
import { IdentityWrapper } from 'library/ListItem/Wrappers';
import { clipAddress, determinePoolDisplay } from 'Utils';
import { PoolIdentityProps } from '../types';

export const PoolIdentity = (props: PoolIdentityProps) => {
  const { meta } = useBondedPools();

  const { pool, batchKey, batchIndex } = props;
  const { addresses } = pool;

  // get metadata from pools metabatch
  const metadata = meta[batchKey]?.metadata ?? [];

  // aggregate synced status
  const metadataSynced = metadata.length > 0 ?? false;

  // pool display name
  const display = determinePoolDisplay(addresses.stash, metadata[batchIndex]);

  return (
    <IdentityWrapper className="identity">
      <Identicon value={addresses.stash} size={26} />
      <div className="inner">
        {!metadataSynced ? (
          <h4>{clipAddress(addresses.stash)}</h4>
        ) : (
          <h4>{display}</h4>
        )}
      </div>
    </IdentityWrapper>
  );
};
