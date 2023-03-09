// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { ValidatorList } from 'library/ValidatorList';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper } from 'Wrappers';
import type { PageProps } from '../types';

export const Favorites = ({ page }: PageProps) => {
  const { t } = useTranslation();
  const { isReady } = useApi();
  const { key } = page;
  const { favoritesList } = useValidators();

  const batchKey = 'favorite_validators';

  return (
    <>
      <PageTitle title={t(key, { ns: 'base' })} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {favoritesList === null ? (
            <h3>
              {t('favorites.fetchingFavoriteValidators', { ns: 'pages' })}...
            </h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favoritesList.length > 0 ? (
                    <ValidatorList
                      bondFor="nominator"
                      validators={favoritesList}
                      batchKey={batchKey}
                      title={t('favorites.favoriteValidators', {
                        ns: 'pages',
                      })}
                      selectable={false}
                      refetchOnListUpdate
                      allowMoreCols
                      toggleFavorites
                    />
                  ) : (
                    <h3>{t('favorites.noFavorites', { ns: 'pages' })}</h3>
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
