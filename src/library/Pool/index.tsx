// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePoolCommission } from 'hooks/usePoolCommission';
import { FavoritePool } from 'library/ListItem/Labels/FavoritePool';
import { PoolBonded } from 'library/ListItem/Labels/PoolBonded';
import { PoolCommission } from 'library/ListItem/Labels/PoolCommission';
import { PoolIdentity } from 'library/ListItem/Labels/PoolIdentity';
import { Labels, Separator, Wrapper } from 'library/ListItem/Wrappers';
import { usePoolsTabs } from 'pages/Pools/Home/context';
import { JoinPool } from '../ListItem/Labels/JoinPool';
import { Members } from '../ListItem/Labels/Members';
import { PoolId } from '../ListItem/Labels/PoolId';
import type { PoolProps } from './types';
import { Rewards } from './Rewards';
import { useSyncing } from 'hooks/useSyncing';

export const Pool = ({ pool }: PoolProps) => {
  const { memberCounter, addresses, id } = pool;
  const { setActiveTab } = usePoolsTabs();
  const { syncing } = useSyncing(['active-pools']);
  const { getCurrentCommission } = usePoolCommission();

  const currentCommission = getCurrentCommission(id);

  return (
    <Wrapper className="pool-more">
      <div className="inner">
        <div className="row top">
          <PoolIdentity pool={pool} />
          <div>
            <Labels>
              <FavoritePool address={addresses.stash} />
            </Labels>
          </div>
        </div>
        <Separator />
        <div className="row bottom lg">
          <div>
            <Rewards address={addresses.stash} displayFor="default" />
          </div>
          <div>
            <Labels style={{ marginBottom: '0.9rem' }}>
              {currentCommission > 0 && (
                <PoolCommission commission={`${currentCommission}%`} />
              )}
              <PoolId id={id} />
              <Members members={memberCounter} />
            </Labels>
            <PoolBonded pool={pool} />

            <Labels style={{ marginTop: '1rem' }}>
              <JoinPool
                id={id}
                setActiveTab={setActiveTab}
                disabled={syncing}
              />
            </Labels>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
