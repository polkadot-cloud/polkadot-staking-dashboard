// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { useApi } from '../../contexts/Api';
import { useValidators } from '../../contexts/Validators';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { ValidatorList } from '../../library/ValidatorList';
import { PageTitle } from '../../library/PageTitle';
import { PageRowWrapper } from '../../Wrappers';

export const Favourites = (props: PageProps) => {

  const { isReady }: any = useApi();
  const { page } = props;
  const { title } = page;
  const { favouritesList } = useValidators();

  const batchKey = 'favourite_validators';

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