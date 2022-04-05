// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { PageProps } from '../types';
import { useApi } from '../../contexts/Api';
import { useStaking } from '../../contexts/Staking';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { ValidatorList } from '../../library/ValidatorList';
import { PageTitle } from '../../library/PageTitle';
import { PageRowWrapper } from '../../Wrappers';
import { useConnect } from '../../contexts/Connect';
import { useBalances } from '../../contexts/Balances';

export const Favourites = (props: PageProps) => {

  const { page } = props;
  const { title } = page;
  const { isReady }: any = useApi();
  const { activeAccount } = useConnect();
  const { accounts }: any = useBalances();
  const { favourites, fetchValidatorPrefs }: any = useStaking();

  // TODO: can move this to context to prevent re-fetching on page visit
  const [nominations, setNominations]: any = useState([]);
  const [nominationsWithPrefs, setNominationsWithPrefs] = useState([]);

  const batchKey = 'favourite_validators';

  const fetchNominationsMeta = async () => {
    const _nominationsWithPrefs = await fetchValidatorPrefs(nominations);
    if (_nominationsWithPrefs) {
      setNominationsWithPrefs(_nominationsWithPrefs);
    }
  }

  useEffect(() => {
    let _nominations = favourites;
    _nominations = _nominations.map((item: any, index: any) => { return ({ address: item }) });
    setNominations(_nominations);
  }, [isReady(), activeAccount, accounts, favourites]);

  useEffect(() => {
    if (isReady()) {
      fetchNominationsMeta();
    }
  }, [nominations]);

  return (
    <>
      <PageTitle title={title} />
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          {isReady() &&
            <>
              {nominations.length === 0 &&
                <div className='item'>
                  <h4>No favourite validators saved.</h4>
                </div>
              }

              {nominations.length > 0 &&
                <ValidatorList
                  validators={nominationsWithPrefs}
                  batchKey={batchKey}
                  layout='col'
                  title='Favourite Validators'
                  allowMoreCols
                  pagination
                  toggleFavourites
                />
              }
            </>
          }
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Favourites;