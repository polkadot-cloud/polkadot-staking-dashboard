// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState, useCallback } from 'react';
import { Wrapper } from '../Overview/Announcements/Wrappers';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useStaking } from '../../contexts/Staking';
import { useBalances } from '../../contexts/Balances';
import { ValidatorList } from '../../library/ValidatorList';
import { NominateWrapper } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight as faGo } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { URI_PREFIX } from '../../constants';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

export const Nominations = (props: any) => {

  const navigate = useNavigate();
  const { isReady }: any = useApi();
  const { fetchValidatorPrefs }: any = useStaking();
  const { accounts, getAccountNominations }: any = useBalances();
  const { activeAccount } = useConnect();

  const [fetching, setFetching] = useState(true);
  const [nominations, setNominations] = useState([]);

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
          {nominations.length === 0 &&
            <>
              <h3>Your Nominations <OpenAssistantIcon page="stake" title="Nominations" /></h3>
              <NominateWrapper style={{ marginTop: '0.5rem' }}>
                <motion.button whileHover={{ scale: 1.01 }} onClick={handleBrowseValidatorsClick}>
                  <h2>Manual Selection</h2>
                  <p>Manually browse and nominate validators from the validator list.</p>
                  <div className='foot'>
                    <p className='go'>
                      Browse Validators
                      <FontAwesomeIcon
                        icon={faGo}
                        transform="shrink-2"
                        style={{ marginLeft: '0.5rem' }}
                      />
                    </p>
                  </div>
                </motion.button>
                <motion.button whileHover={{ scale: 1.01 }}>
                  <h2>Smart Nominate</h2>
                  <p>Nominate the most suited validators based on your requirements.</p>
                  <div className='foot'>
                    <p className='go'>
                      Start <FontAwesomeIcon
                        icon={faGo}
                        transform="shrink-2"
                        style={{ marginLeft: '0.5rem' }}
                      />
                    </p>
                  </div>
                </motion.button>
              </NominateWrapper>
            </>
          }
          {nominations.length > 0 &&
            <div style={{ marginTop: '1rem' }}>
              <ValidatorList
                validators={nominations}
                batchKey='stake_nominations'
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
