// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { Wrapper } from '../Overview/Announcements/Wrappers';
import { useApi } from '../../contexts/Api';
import { useStaking } from '../../contexts/Staking';
import { ValidatorList } from '../../library/ValidatorList';

export const Nominations = (props: any) => {

  const { isReady }: any = useApi();
  const { fetchValidatorPrefs }: any = useStaking();

  // re-format list into objects with address
  let nominationsFormatted: any = [];
  let _nominations = props.nominations ?? [];

  for (let i = 0; i < _nominations.length; i++) {
    nominationsFormatted.push({
      address: _nominations[i]
    });
  }

  const [fetching, setFetching] = useState(true);
  const [nominations, setNominations] = useState(nominationsFormatted ?? []);

  const fetchNominationsMeta = async () => {
    const nominationsWithPrefs = await fetchValidatorPrefs(nominationsFormatted);
    if (nominationsWithPrefs) {
      setFetching(false);
      setNominations(nominationsWithPrefs);
    }
  }
  useEffect(() => {
    fetchNominationsMeta();
  }, [isReady(), props.nominations]);

  useEffect(() => {
  }, [nominations]);

  if (fetching) {
    return (
      <Wrapper>
        <div style={{ marginTop: '1rem' }}>
          <h4>Fetching your nominations...</h4>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {isReady() &&
        <>
          {nominations.length === 0 &&
            <div style={{ marginTop: '1rem' }}>
              <h4>Finish staking setup to manage your nominated validators.</h4>
            </div>
          }
          {nominations.length > 0 &&
            <ValidatorList
              validators={nominations}
              batchKey='stake_nominations'
              layout='col'
              title='Your Nominations'
            />
          }
        </>
      }
    </Wrapper>
  );
}

export default Nominations;
