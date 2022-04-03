// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { Wrapper } from '../Overview/Announcements/Wrappers';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useStaking } from '../../contexts/Staking';
import { useBalances } from '../../contexts/Balances';
import { ValidatorList } from '../../library/ValidatorList';
import { useUi } from '../../contexts/UI';
// import { shuffle } from '../../Utils';

export const GenerateNominations = (props: any) => {

  const { isReady }: any = useApi();
  const { getValidatorMetaBatch, validators }: any = useStaking();
  const { accounts }: any = useBalances();
  const { activeAccount } = useConnect();
  const {
    listFormat,
    applyValidatorOrder,
    applyValidatorFilters,
  }: any = useUi();

  const [fetching, setFetching] = useState(true);
  const [nominations, setNominations] = useState([]);

  const rawBatchKey = 'validators_browse';
  const batchKey = 'generated_nominations';

  useEffect(() => {
    // wait for validator meta data to be fetched
    let validatorsReady = getValidatorMetaBatch(rawBatchKey);
    if (validatorsReady !== null) {
      if (validatorsReady.stake === undefined)
        return;
    }
    // generate nominations from validator list
    let _nominations = Object.assign(validators);
    // filter validators to find profitable candidates
    _nominations = applyValidatorFilters(_nominations, rawBatchKey, ['all_commission', 'blocked_nominations', 'over_subscribed', 'inactive']);
    // order validators to find profitable candidates
    _nominations = applyValidatorOrder(_nominations, 'commission');
    // TODO: unbiased shuffle resulting validators
    // _nominations = shuffle(_nominations);
    // choose subset of validators
    _nominations = _nominations.slice(0, 16);
    setNominations(_nominations);
    setFetching(false);
  }, [isReady(), activeAccount, accounts, getValidatorMetaBatch(rawBatchKey)]);

  if (fetching) {
    return (
      <Wrapper>
        <div style={{ marginTop: '1rem' }}>
          <p>Generating nominations...</p>
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
                layout={listFormat}
                title='Generated Nominations'
              />
            </div>
          }
        </>
      }
    </Wrapper>
  );
}

export default GenerateNominations;
