// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageRow } from 'kits/Structure/PageRow';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { CardWrapper } from 'library/Card/Wrappers';
import { ValidatorList } from 'library/ValidatorList';
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators';
import { ListStatusHeader } from 'library/List';

export const ValidatorFavorites = () => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { favoritesList } = useFavoriteValidators();

  return (
    <PageRow>
      <CardWrapper>
        {favoritesList === null ? (
          <ListStatusHeader>
            {t('validators.fetchingFavoriteValidators')}...
          </ListStatusHeader>
        ) : (
          isReady &&
          (favoritesList.length > 0 ? (
            <ValidatorList
              bondFor="nominator"
              validators={favoritesList}
              title={t('validators.favoriteValidators')}
              selectable={false}
              allowListFormat={false}
              allowFilters
              refetchOnListUpdate
              allowMoreCols
              toggleFavorites
            />
          ) : (
            <ListStatusHeader>{t('validators.noFavorites')}</ListStatusHeader>
          ))
        )}
      </CardWrapper>
    </PageRow>
  );
};
