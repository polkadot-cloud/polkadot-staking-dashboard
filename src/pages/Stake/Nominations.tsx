// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from '../Overview/Announcements/Wrappers';
import { useApi } from '../../contexts/Api';
import { ValidatorList } from '../../library/ValidatorList';

export const Nominations = (props: any) => {

  const { isReady }: any = useApi();

  const { nominations } = props;

  let nominationsFormatted = [];
  for (let i = 0; i < nominations.length; i++) {
    nominationsFormatted.push({
      address: nominations[i]
    });
  }

  return (
    <Wrapper>
      {isReady() &&
        <>
          {nominationsFormatted.length === 0 &&
            <>
              <div style={{ marginTop: '1rem' }}>
                <h4>Finish staking setup to manage your nominated validators.</h4>
              </div>
            </>
          }
          {nominationsFormatted.length > 0 &&
            <ValidatorList
              validators={nominationsFormatted}
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
