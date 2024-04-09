// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePoolCommission } from 'hooks/usePoolCommission';
import { FavoritePool } from 'library/ListItem/Labels/FavoritePool';
import { PoolNominateStatus } from 'library/ListItem/Labels/PoolNominateStatus';
import { PoolCommission } from 'library/ListItem/Labels/PoolCommission';
import { PoolIdentity } from 'library/ListItem/Labels/PoolIdentity';
import { Labels, Separator, Wrapper } from 'library/ListItem/Wrappers';
import { usePoolsTabs } from 'pages/Pools/Home/context';
import { More } from '../ListItem/Labels/More';
import { Members } from '../ListItem/Labels/Members';
import { PoolId } from '../ListItem/Labels/PoolId';
import type { PoolProps } from './types';
import { useSyncing } from 'hooks/useSyncing';
import { PoolBonded } from 'library/ListItem/Labels/PoolBonded';

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
        <div
          className="row bottom lg"
          style={{ alignItems: 'flex-start', paddingTop: '0.75rem' }}
        >
          <div>
            <Labels style={{ marginBottom: '0.9rem' }}>&nbsp;</Labels>
            <PoolNominateStatus pool={pool} />
          </div>
          <div>
            <Labels style={{ marginBottom: '0.9rem' }}>
              {currentCommission > 0 && (
                <PoolCommission commission={`${currentCommission}%`} />
              )}
              <PoolId id={id} />
              <Members members={memberCounter} />
              {<PoolBonded pool={pool} />}
            </Labels>

            <Labels>
              <More
                pool={pool}
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
