// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRow } from '@polkadotcloud/core-ui';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Card/Wrappers';
import { ValidatorList } from 'library/ValidatorList';

export const ValidatorFavorites = () => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { favoritesList } = useValidators();

  const batchKey = 'favorite_validators';

  return (
    <>
      <PageRow>
        <CardWrapper>
          {favoritesList === null ? (
            <h3>{t('validators.fetchingFavoriteValidators')}...</h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favoritesList.length > 0 ? (
                    <ValidatorList
                      bondFor="nominator"
                      validators={favoritesList}
                      batchKey={batchKey}
                      title={t('validators.favoriteValidators')}
                      selectable={false}
                      refetchOnListUpdate
                      allowMoreCols
                      toggleFavorites
                    />
                  ) : (
                    <h3>{t('validators.noFavorites')}</h3>
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
