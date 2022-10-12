// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useApi } from 'contexts/Api';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageRowWrapper } from 'Wrappers';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import PoolList from 'library/PoolList';
import { useUi } from 'contexts/UI';
import { useTranslation } from 'react-i18next';

export const Favorites = () => {
  const { isReady } = useApi();
  const { favorites, removeFavorite } = usePoolsConfig();
  const { bondedPools } = useBondedPools();
  const { isSyncing } = useUi();
  const { t } = useTranslation('common');

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
          {favoritesList === null || isSyncing ? (
            <h3>{t('pages.pools.fetching_favourite_pools')}</h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favoritesList.length > 0 ? (
                    <PoolList
                      batchKey="favorite_pools"
                      pools={favoritesList}
                      title={t('pages.pools.favourites_list')}
                      allowMoreCols
                      pagination
                    />
                  ) : (
                    <h3>{t('pages.pools.no_favourites')}</h3>
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
