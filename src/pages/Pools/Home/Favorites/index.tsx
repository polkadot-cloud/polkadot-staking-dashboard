// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Graphs/Wrappers';
import PoolList from 'library/PoolList';
import { useEffect, useState } from 'react';
import { PageRowWrapper } from 'Wrappers';

export const Favorites = () => {
  const { isReady } = useApi();
  const { favorites, removeFavorite } = usePoolsConfig();
  const { bondedPools } = useBondedPools();
  const { poolsSyncing } = useUi();

  // store local favorite list and update when favorites list is mutated
  const [favoritesList, setFavoritesList] = useState<Array<any>>([]);

  useEffect(() => {
    // map favorites to bonded pools
    let _favoritesList = favorites.map((f: any) => {
      const pool = bondedPools.find((b: any) => b.addresses.stash === f);
      if (!pool) {
        removeFavorite(f);
      }
      return pool;
    });

    // filter not found bonded pools
    _favoritesList = _favoritesList.filter((f: any) => f !== undefined);

    setFavoritesList(_favoritesList);
  }, [favorites]);

  return (
    <>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {favoritesList === null || poolsSyncing ? (
            <h3>Fetching favorite pools...</h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favoritesList.length > 0 ? (
                    <PoolList
                      batchKey="favorite_pools"
                      pools={favoritesList}
                      title="Favorites List"
                      allowMoreCols
                      pagination
                    />
                  ) : (
                    <h3>No Favorites.</h3>
                  )}
                </>
              )}
            </>
          )}
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Favorites;
