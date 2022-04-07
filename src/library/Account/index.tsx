// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Identicon from '@polkadot/react-identicon';
import Wrapper from './Wrapper';
import { clipAddress } from '../../Utils';

export const Account = (props: any) => {

  let { address, label, unassigned, filled }: any = props;
  let { canClick }: { canClick: boolean } = props;

  address = address === undefined ? 'Unassigned' : address;
  filled = filled === undefined ? false : filled;

  return (
    <Wrapper
      whileHover={{ scale: 1.01 }}
      style={{ paddingLeft: 0 }}
      onClick={props.onClick}
      cursor={canClick ? `pointer` : `default`}
      fill={filled ? 'rgb(237, 237, 237)' : 'none'}
    >
      {unassigned &&
        <span className='title unassigned'>Not Set</span>
      }
      {
        unassigned !== true &&
        <>
          <Identicon
            value={address}
            size={26}
            theme="polkadot"
            style={{ cursor: 'default' }}
          />
          <span className='title'>{clipAddress(address)}</span>
        </>
      }

      {
        label !== undefined &&
        <div className='label'>{label}</div>
      }
    </Wrapper >
  );
}

export default Account;