// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from './Wrapper';
import { useApi } from '../../../../contexts/Api';
import { useValidators } from '../../../../contexts/Validators/Validators';
import { ValidatorList } from '../../../../library/ValidatorList';
import { OpenAssistantIcon } from '../../../../library/OpenAssistantIcon';
import { Button } from '../../../../library/Button';

export const Nominations = () => {

  const { isReady }: any = useApi();
  const { nominated }: any = useValidators();
  const batchKey = 'stake_nominations';

  return (
    <Wrapper>
      <div className='head'>
        <h2>
          Nominations
          <OpenAssistantIcon page="stake" title="Nominations" />
        </h2>
        <div>
          <div>
            <Button
              small
              inline
              primary
              title="Stop"
              onClick={() => { }}
            />
          </div>
        </div>
      </div>
      {nominated === null
        ?
        <div style={{ marginTop: '1rem' }}>
          <p>Fetching your nominations...</p>
        </div>
        :
        <>
          {isReady &&
            <>
              {nominated.length > 0 &&
                <div style={{ marginTop: '1rem' }}>
                  <ValidatorList
                    validators={nominated}
                    batchKey={batchKey}
                    title='Your Nominations'
                    refetchOnListUpdate
                    allowMoreCols
                    disableThrottle
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
