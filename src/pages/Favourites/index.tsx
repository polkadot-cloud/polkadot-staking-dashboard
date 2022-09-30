// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { ValidatorList } from 'library/ValidatorList';
import { PageTitle } from 'library/PageTitle';
import { PageRowWrapper } from 'Wrappers';
import { useTranslation } from 'react-i18next';
import { PageProps } from '../types';

export const Favourites = (props: PageProps) => {
  const { isReady } = useApi();
  const { page } = props;
  const { title } = page;
  const { favouritesList } = useValidators();
  const { t } = useTranslation('common');

  const batchKey = 'favourite_validators';

  return (
    <>
      <PageTitle title={title} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {favouritesList === null ? (
            <h3>{t('pages.Favourites.fetching_favourite_validators')}</h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favouritesList.length > 0 ? (
                    <ValidatorList
                      bondType="stake"
                      validators={favouritesList}
                      batchKey={batchKey}
                      title={t('pages.Favourites.favourite_validators')}
                      selectable={false}
                      refetchOnListUpdate
                      allowMoreCols
                      toggleFavourites
                    />
                  ) : (
                    <h3>{t('pages.Favourites.no_favourites')}</h3>
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
