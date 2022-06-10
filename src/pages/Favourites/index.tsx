// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { ValidatorList } from 'library/ValidatorList';
import { PageTitle } from 'library/PageTitle';
import { BatchKeys } from 'library/batchKeys';
import { PageRowWrapper } from 'Wrappers';
import { APIContextInterface } from 'types/api';
import { PageProps } from '../types';

export const Favourites = (props: PageProps) => {
  const { isReady } = useApi() as APIContextInterface;
  const { page } = props;
  const { title } = page;
  const { favouritesList } = useValidators();

  const batchKey = BatchKeys.new('favourite_validators');

  return (
    <>
      <PageTitle title={title} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {favouritesList === null ? (
            <h3>Fetching favourite validators...</h3>
          ) : (
            <>
              {isReady && (
                <>
                  {favouritesList.length > 0 ? (
                    <ValidatorList
                      validators={favouritesList}
                      batchKey={batchKey}
                      title="Favourite Validators"
                      selectable={false}
                      refetchOnListUpdate
                      allowMoreCols
                      toggleFavourites
                    />
                  ) : (
                    <h3>No Favourites.</h3>
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
