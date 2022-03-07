// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Identicon from '@polkadot/react-identicon';
import Wrapper from './Wrapper';
import { clipAddress } from '../../Utils';

export const Account = (props: any) => {

  let { address, label }: any = props;

  address = address === undefined ? 'Unassigned' : address;

  return (
    <Wrapper
      whileHover={{ scale: 1.02 }}
      style={{ paddingLeft: 0 }}
    >
      <Identicon
        value={address}
        size={26}
        theme="polkadot"
      />
      <span className='title'>{clipAddress(address)}</span>
      {label !== undefined &&
        <div className='label'>{label}</div>
      }
    </Wrapper>
  );
}

export default Account;