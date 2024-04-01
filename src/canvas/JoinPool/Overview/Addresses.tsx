// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedPool } from 'contexts/Pools/BondedPools/types';
import { CardWrapper } from 'library/Card/Wrappers';
import { AddressesWrapper, HeadingWrapper } from '../Wrappers';
import { AddressSection } from './AddressSection';

export const Addresses = ({ bondedPool }: { bondedPool: BondedPool }) => (
  <div>
    <CardWrapper className="canvas secondary">
      <HeadingWrapper>
        <h3>Pool Addresses</h3>
      </HeadingWrapper>

      <AddressesWrapper>
        <AddressSection address={bondedPool.addresses.stash} label="Stash" />
        <AddressSection address={bondedPool.addresses.reward} label="Reward" />
      </AddressesWrapper>
    </CardWrapper>
  </div>
);
