// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from '../Overview/Announcements/Wrappers';
import { useApi } from '../../contexts/Api';
import { ValidatorList } from '../../library/ValidatorList';

export const Nominations = (props: any) => {

  const { isReady }: any = useApi();
  const { nominations } = props;

  return (
    <Wrapper>
      <h3>Your Nominations</h3>

      {isReady() &&
        <>
          {nominations.length === 0 &&
            <div className='item' >
              <h4>Finish staking setup to manage your nominated validators.</h4>
            </div>
          }

          {nominations.length > 0 &&
            <ValidatorList validators={nominations} />
          }
        </>
      }
    </Wrapper>
  );
}

export default Nominations;
