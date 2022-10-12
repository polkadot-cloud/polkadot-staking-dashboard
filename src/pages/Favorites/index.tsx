// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { ValidatorList } from 'library/ValidatorList';
import { PageTitle } from 'library/PageTitle';
import { PageRowWrapper } from 'Wrappers';
import { useTranslation } from 'react-i18next';

export const Favorites = () => {
  const { isReady } = useApi();
  const { favoritesList } = useValidators();
  const { t: tCommon } = useTranslation('common');

  const batchKey = 'favorite_validators';

  return (
    <>
      <PageTitle title="Favorites" />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {favoritesList === null ? (
            <h3>{tCommon('pages.favourites.fetching_favourite_validators')}</h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favoritesList.length > 0 ? (
                    <ValidatorList
                      bondType="stake"
                      validators={favoritesList}
                      batchKey={batchKey}
                      title={tCommon('pages.favourites.favourite_validators')}
                      selectable={false}
                      refetchOnListUpdate
                      allowMoreCols
                      toggleFavorites
                    />
                  ) : (
                    <h3>{tCommon('pages.favourites.no_favourites')}</h3>
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
