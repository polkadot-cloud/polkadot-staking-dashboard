// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network';
import { HeadingWrapper } from '../Wrappers';
import { JoinForm } from './JoinForm';
import type { BondedPool } from 'contexts/Pools/BondedPools/types';
import { Rewards } from 'library/Pool/Rewards';

export const Overview = ({ bondedPool }: { bondedPool: BondedPool }) => {
  const {
    networkData: {
      brand: { token: Token },
    },
  } = useNetwork();
  return (
    <>
      <div>
        <HeadingWrapper>
          <h4>
            <span className="active">Actively Nominating</span>

            <span>11,234 Members</span>

            <span>
              <Token className="icon" />
              1,2345 Bonded
            </span>
          </h4>
        </HeadingWrapper>

        <Rewards address={bondedPool.addresses.stash} displayFor="canvas" />
      </div>

      <div>
        <JoinForm />
      </div>
    </>
  );
};
