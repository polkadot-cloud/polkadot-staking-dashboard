// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn, determinePoolDisplay } from '@polkadot-cloud/utils';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { Polkicon } from '@polkadot-cloud/react';
import { IdentityWrapper } from 'library/ListItem/Wrappers';
import type { PoolIdentityProps } from '../types';

export const PoolIdentity = ({
  pool: { addresses, id },
}: PoolIdentityProps) => {
  const { poolsMetaData } = useBondedPools();
  const metadataSynced = Object.values(poolsMetaData).length > 0 || false;

  const display = determinePoolDisplay(
    addresses.stash,
    poolsMetaData[Number(id)]
  );

  return (
    <IdentityWrapper className="identity">
      <Polkicon address={addresses.stash} size="2rem" />
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
