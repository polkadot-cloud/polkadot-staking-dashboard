// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { Wrapper } from '../Overview/Announcements/Wrappers';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useStaking } from '../../contexts/Staking';
import { useBalances } from '../../contexts/Balances';
import { ValidatorList } from '../../library/ValidatorList';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

export const Nominations = () => {

  const { isReady }: any = useApi();
  const { fetchValidatorPrefs }: any = useStaking();
  const { accounts, getAccountNominations }: any = useBalances();
  const { activeAccount } = useConnect();

  const [fetching, setFetching] = useState(true);

  // TODO: can move this to context to prevent re-fetching on page visit
  const [nominations, setNominations] = useState([]);
  const [nominationsWithPrefs, setNominationsWithPrefs] = useState([]);

  const batchKey = 'stake_nominations';

  const fetchNominationsMeta = async () => {
    const _nominationsWithPrefs = await fetchValidatorPrefs(nominations);
    if (_nominationsWithPrefs) {
      setNominationsWithPrefs(_nominationsWithPrefs);
    }
    setFetching(false);
  }

  useEffect(() => {
    let _nominations = getAccountNominations(activeAccount);
    _nominations = _nominations.map((item: any, index: any) => { return ({ address: item }) });
    setNominations(_nominations);
  }, [isReady, activeAccount, accounts]);

  useEffect(() => {
    if (isReady) {
      fetchNominationsMeta();
    }
  }, [nominations]);

  return (
    <Wrapper>
      <h2>
        Nominations
        <OpenAssistantIcon page="stake" title="Nominations" />
      </h2>
      {fetching
        ?
        <div style={{ marginTop: '1rem' }}>
          <p>Fetching your nominations...</p>
        </div>
        :
        <>
          {isReady &&
            <>
              {nominationsWithPrefs.length > 0 &&
                <div style={{ marginTop: '1rem' }}>
                  <ValidatorList
                    validators={nominationsWithPrefs}
                    batchKey={batchKey}
                    layout='col'
                    title='Your Nominations'
                    refetchOnListUpdate
                    allowMoreCols
                  />
                </div>
              }
            </>
          }
        </>
      }
    </Wrapper>
  );
}

export default Nominations;
