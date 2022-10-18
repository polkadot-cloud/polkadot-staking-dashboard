// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { ValidatorList } from 'library/ValidatorList';
import { PageRowWrapper } from 'Wrappers';

import { PageProps } from '../types';

export const Favorites = (props: PageProps) => {
  const { isReady } = useApi();
  const { page } = props;
  const { title } = page;
  const { favoritesList } = useValidators();

  const batchKey = 'favorite_validators';

  return (
    <>
      <PageTitle title={title} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {favoritesList === null ? (
            <h3>Fetching favorite validators...</h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favoritesList.length > 0 ? (
                    <ValidatorList
                      bondType="stake"
                      validators={favoritesList}
                      batchKey={batchKey}
                      title="Favorite Validators"
                      selectable={false}
                      refetchOnListUpdate
                      allowMoreCols
                      toggleFavorites
                    />
                  ) : (
                    <h3>No Favorites.</h3>
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
