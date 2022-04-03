// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState, useCallback } from 'react';
import { Wrapper } from '../Overview/Announcements/Wrappers';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useStaking } from '../../contexts/Staking';
import { useBalances } from '../../contexts/Balances';
import { ValidatorList } from '../../library/ValidatorList';
import { useNavigate } from 'react-router-dom';
import { URI_PREFIX } from '../../constants';

export const Nominations = (props: any) => {

  const navigate = useNavigate();
  const { isReady }: any = useApi();
  const { fetchValidatorPrefs }: any = useStaking();
  const { accounts, getAccountNominations }: any = useBalances();
  const { activeAccount } = useConnect();

  const [fetching, setFetching] = useState(true);
  const [nominations, setNominations] = useState([]);

  const batchKey = 'stake_nominations';

  const fetchNominationsMeta = async () => {
    const nominationsWithPrefs = await fetchValidatorPrefs(nominations);
    if (nominationsWithPrefs) {
      setNominations(nominationsWithPrefs);
    }
    setFetching(false);
  }

  useEffect(() => {
    let _nominations = getAccountNominations(activeAccount);
    _nominations = _nominations.map((item: any, index: any) => { return ({ address: item }) });

    setNominations(_nominations);
  }, [isReady(), activeAccount, accounts]);

  useEffect(() => {
    fetchNominationsMeta();
  }, [isReady()]);

  const handleBrowseValidatorsClick = useCallback(() => navigate(URI_PREFIX + '/validators', { replace: true }), [navigate]);

  if (fetching) {
    return (
      <Wrapper>
        <div style={{ marginTop: '1rem' }}>
          <p>Fetching your nominations...</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {isReady() &&
        <>
          {nominations.length > 0 &&
            <div style={{ marginTop: '1rem' }}>
              <ValidatorList
                validators={nominations}
                batchKey={batchKey}
                layout='col'
                title='Your Nominations'
              />
            </div>
          }
        </>
      }
    </Wrapper>
  );
}

export default Nominations;
