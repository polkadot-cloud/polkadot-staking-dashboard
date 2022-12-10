// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { ValidatorList } from 'library/ValidatorList';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper } from 'Wrappers';
import { PageProps } from '../types';

export const Favorites = (props: PageProps) => {
  const { isReady } = useApi();
  const { page } = props;
  const { key } = page;
  const { favoritesList } = useValidators();
  const { t } = useTranslation();

  const batchKey = 'favorite_validators';

  return (
    <>
      <PageTitle title={t(key, { ns: 'base' })} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {favoritesList === null ? (
            <h3>
              {t('favorites.fetching_favorite_validators', { ns: 'pages' })}...
            </h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favoritesList.length > 0 ? (
                    <ValidatorList
                      bondType="stake"
                      validators={favoritesList}
                      batchKey={batchKey}
                      title={t('favorites.favorite_validators', {
                        ns: 'pages',
                      })}
                      selectable={false}
                      refetchOnListUpdate
                      allowMoreCols
                      toggleFavorites
                    />
                  ) : (
                    <h3>{t('favorites.no_favorites', { ns: 'pages' })}</h3>
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
