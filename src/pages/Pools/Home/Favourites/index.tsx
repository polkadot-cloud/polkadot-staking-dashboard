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

export const Favourites = () => {
  const { isReady } = useApi();
  const { favourites, removeFavourite } = usePoolsConfig();
  const { bondedPools } = useBondedPools();
  const { isSyncing } = useUi();
  const { t } = useTranslation('common');

  // store local favourite list and update when favourites list is mutated
  const [favouritesList, setFavouritesList] = useState<Array<any>>([]);

  useEffect(() => {
    // map favourites to bonded pools
    let _favouritesList = favourites.map((f: any) => {
      const pool = bondedPools.find((b: any) => b.addresses.stash === f);
      if (!pool) {
        removeFavourite(f);
      }
      return pool;
    });

    // filter not found bonded pools
    _favouritesList = _favouritesList.filter((f: any) => f !== undefined);

    setFavouritesList(_favouritesList);
  }, [favourites]);

  return (
    <>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {favouritesList === null || isSyncing ? (
            <h3>{t('pages.pools.fetching_favourite_pools')}</h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favouritesList.length > 0 ? (
                    <PoolList
                      batchKey="favourite_pools"
                      pools={favouritesList}
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

export default Favourites;
