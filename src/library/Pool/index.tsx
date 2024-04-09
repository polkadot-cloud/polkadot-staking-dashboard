// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePoolCommission } from 'hooks/usePoolCommission';
import { FavoritePool } from 'library/ListItem/Labels/FavoritePool';
import { PoolNominateStatus } from 'library/ListItem/Labels/PoolNominateStatus';
import { PoolCommission } from 'library/ListItem/Labels/PoolCommission';
import { PoolIdentity } from 'library/ListItem/Labels/PoolIdentity';
import { Labels, Separator, Wrapper } from 'library/ListItem/Wrappers';
import { usePoolsTabs } from 'pages/Pools/Home/context';
import { JoinPool } from '../ListItem/Labels/JoinPool';
import { Members } from '../ListItem/Labels/Members';
import { PoolId } from '../ListItem/Labels/PoolId';
import type { PoolProps } from './types';
import { useSyncing } from 'hooks/useSyncing';
import { useNetwork } from 'contexts/Network';
import { planckToUnit, rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';

export const Pool = ({ pool }: PoolProps) => {
  const { memberCounter, addresses, id, points } = pool;
  const { setActiveTab } = usePoolsTabs();
  const { syncing } = useSyncing(['active-pools']);
  const { getCurrentCommission } = usePoolCommission();
  const {
    networkData: {
      units,
      brand: { inline },
    },
  } = useNetwork();

  const TokenIcon = inline.svg;

  const currentCommission = getCurrentCommission(id);

  // Calculate total bonded pool amount.
  const bonded = planckToUnit(new BigNumber(rmCommas(points)), units);

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
              <div className="label pool">
                <TokenIcon height="1rem" style={{ marginRight: '0.25rem' }} />{' '}
                {bonded.decimalPlaces(0).toFormat()}
              </div>
            </Labels>

            <Labels>
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
