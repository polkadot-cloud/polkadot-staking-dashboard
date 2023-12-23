// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageRow } from '@polkadot-cloud/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Card/Wrappers';
import { PoolList } from 'library/PoolList/Default';
import { ListStatusHeader } from 'library/List';
import { PoolListProvider } from 'library/PoolList/context';
import type { BondedPool } from 'contexts/Pools/BondedPools/types';

export const PoolFavorites = () => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { isPoolSyncing } = useUi();
  const { bondedPools } = useBondedPools();
  const { favorites, removeFavorite } = usePoolsConfig();

  // Store local favorite list and update when favorites list is mutated.
  const [favoritesList, setFavoritesList] = useState<BondedPool[]>([]);

  useEffect(() => {
    // map favorites to bonded pools
    const newFavoritesList = favorites
      .map((f) => {
        const pool = bondedPools.find((b) => b.addresses.stash === f);
        if (!pool) {
          removeFavorite(f);
        }
        return pool;
      })
      .filter((f): f is BondedPool => f !== undefined);

    // filter not found bonded pools
    setFavoritesList(newFavoritesList);
  }, [favorites]);

  return (
    <PageRow>
      <CardWrapper>
        {favoritesList === null || isPoolSyncing ? (
          <ListStatusHeader>
            {t('pools.fetchingFavoritePools')}...
          </ListStatusHeader>
        ) : (
          isReady &&
          (favoritesList.length > 0 ? (
            <PoolListProvider>
              <PoolList pools={favoritesList} allowMoreCols pagination />
            </PoolListProvider>
          ) : (
            <ListStatusHeader>{t('pools.noFavorites')}</ListStatusHeader>
          ))
        )}
      </CardWrapper>
    </PageRow>
  );
};
