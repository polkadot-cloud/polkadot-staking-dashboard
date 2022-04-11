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
  const { favourites, fetchValidatorPrefs, removeIndexFromBatch, fetchValidatorMetaBatch }: any = useStaking();

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

  // pre-configure nominations
  useEffect(() => {
    let _nominations = favourites;
    _nominations = _nominations.map((item: any) => { return ({ address: item }) });
    setNominations(_nominations);
  }, [isReady, activeAccount, accounts, favourites]);

  // refetch meta batch when revisiting the page. Favourites may have been updated.
  useEffect(() => {
    let _nominations = favourites;
    if (_nominations.length) {
      _nominations = _nominations.map((item: any) => { return ({ address: item }) });
      fetchValidatorMetaBatch(batchKey, _nominations, true);
    }
  }, []);

  // handle favourite removal
  useEffect(() => {
    if (isReady) {
      // remove item from meta batxh
      const removedItem: any = nominationsWithPrefs.filter((_n: any) => {
        let f = nominations.find((_m: any) => _m.address === _n.address);
        return (f === undefined);
      });
      if (removedItem.length) {
        const index = nominationsWithPrefs.map((item: any) => item.address).indexOf(removedItem[0].address);
        removeIndexFromBatch(batchKey, index);
      }
      // update list meta
      fetchNominationsMeta();
    }
  }, [nominations]);

  return (
    <>
      <PageTitle title={title} />
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          {isReady &&
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