// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from './Wrapper';
import Identicon from '@polkadot/react-identicon';
import { clipAddress } from '../../Utils';

export const Validator = (props: any) => {

  const { address } = props;

  return (
    <Wrapper>
      <div>
        <Identicon
          value={address}
          size={26}
          theme="polkadot"
          style={{ cursor: 'default' }}
        />
        <div className='right'>
          <h4>{clipAddress(address)}</h4>
        </div>
      </div>
    </Wrapper>
  )
}

export default Validator;
