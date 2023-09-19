// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, determinePoolDisplay } from '@polkadot-cloud/utils';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { PolkadotIcon } from '@polkadot-cloud/react';
import { IdentityWrapper } from 'library/ListItem/Wrappers';
import type { PoolIdentityProps } from '../types';

export const PoolIdentity = ({
  pool,
  batchKey,
  batchIndex,
}: PoolIdentityProps) => {
  const { meta } = useBondedPools();
  const { addresses } = pool;

  // get metadata from pools metabatch
  const metadata = meta[batchKey]?.metadata ?? [];

  // aggregate synced status
  const metadataSynced = metadata.length > 0 ?? false;

  // pool display name
  const display = determinePoolDisplay(addresses.stash, metadata[batchIndex]);

  return (
    <IdentityWrapper className="identity">
      <PolkadotIcon address={addresses.stash} size={26} />
      <div className="inner">
        {!metadataSynced ? (
          <h4>{ellipsisFn(addresses.stash)}</h4>
        ) : (
          <h4>{display}</h4>
        )}
      </div>
    </IdentityWrapper>
  );
};
