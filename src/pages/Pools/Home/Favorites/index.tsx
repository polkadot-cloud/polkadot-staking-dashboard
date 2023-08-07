// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRow } from '@polkadotcloud/core-ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Card/Wrappers';
import { PoolList } from 'library/PoolList/Default';

export const PoolFavorites = () => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { favorites, removeFavorite } = usePoolsConfig();
  const { bondedPools } = useBondedPools();
  const { isPoolSyncing } = useUi();

  // store local favorite list and update when favorites list is mutated
  const [favoritesList, setFavoritesList] = useState<any[]>([]);

  useEffect(() => {
    // map favorites to bonded pools
    let newFavoritesList = favorites.map((f) => {
      const pool = !bondedPools.find((b) => b.addresses.stash === f);
      if (!pool) removeFavorite(f);
      return pool;
    });

    // filter not found bonded pools
    newFavoritesList = newFavoritesList.filter((f: any) => f !== undefined);

    setFavoritesList(newFavoritesList);
  }, [favorites]);

  return (
    <>
      <PageRow>
        <CardWrapper>
          {favoritesList === null || isPoolSyncing ? (
            <h3>{t('pools.fetchingFavoritePools')}...</h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favoritesList.length > 0 ? (
                    <PoolList
                      batchKey="favorite_pools"
                      pools={favoritesList}
                      title={t('pools.favoritesList')}
                      allowMoreCols
                      pagination
                    />
                  ) : (
                    <h3>{t('pools.noFavorites')}</h3>
                  )}
                </>
              )}
            </>
          )}
        </CardWrapper>
      </PageRow>
    </>
  );
};
