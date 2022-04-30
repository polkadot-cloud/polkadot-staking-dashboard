// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from '../Overview/Announcements/Wrappers';
import { useApi } from '../../contexts/Api';
import { useValidators } from '../../contexts/Validators';
import { ValidatorList } from '../../library/ValidatorList';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

export const Nominations = () => {

  const { isReady }: any = useApi();
  const { nominated }: any = useValidators();
  const batchKey = 'stake_nominations';

  return (
    <Wrapper>
      <h2>
        Nominations
        <OpenAssistantIcon page="stake" title="Nominations" />
      </h2>
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
                    layout='col'
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
