// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { PageProps } from '../types';
import { useApi } from '../../contexts/Api';
import { useValidators } from '../../contexts/Validators';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { ValidatorList } from '../../library/ValidatorList';
import { PageTitle } from '../../library/PageTitle';
import { PageRowWrapper } from '../../Wrappers';
import { useBalances } from '../../contexts/Balances';

export const Favourites = (props: PageProps) => {

  const { isReady }: any = useApi();
  const { page } = props;
  const { title } = page;
  const { accounts }: any = useBalances();
  const { fetchValidatorMetaBatch, favouritesList } = useValidators();

  const batchKey = 'favourite_validators';

  // fetch meta batch and force refresh
  useEffect(() => {
    if (favouritesList !== null) {
      fetchValidatorMetaBatch(batchKey, favouritesList, true);
    }
  }, [isReady, accounts, favouritesList]);

  return (
    <>
      <PageTitle title={title} />
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          {favouritesList === null
            ?
            <h4>Fetching favourite validators...</h4>
            :
            <>
              {isReady &&
                <>
                  {favouritesList.length > 0 &&
                    <ValidatorList
                      validators={favouritesList}
                      batchKey={batchKey}
                      layout='col'
                      title='Favourite Validators'
                      refetchOnListUpdate
                      allowMoreCols
                      toggleFavourites
                    />
                  }
                </>
              }
            </>
          }
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Favourites;