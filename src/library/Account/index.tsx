// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Identicon from '@polkadot/react-identicon';
import Wrapper from './Wrapper';
import { clipAddress } from '../../Utils';
import { useConnect } from '../../contexts/Connect';

export const Account = (props: any) => {

  const { getAccount } = useConnect();

  // data props
  let { value, label }: any = props;

  // presentational props
  let { unassigned, format }: any = props;

  let filled = props.filled ?? false;

  // functional props
  let { canClick }: { canClick: boolean } = props;

  // format value based on `format` prop
  let displayValue;
  switch (format) {
    case 'name':
      displayValue = getAccount(value)?.name;
      break;
    default:
      if (value) {
        displayValue = clipAddress(value);
      }
  }

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
      {unassigned !== true &&
        <>
          <Identicon
            value={value}
            size={26}
            theme="polkadot"
            style={{ cursor: 'default' }}
          />
          <span className='title'>{displayValue}</span>
        </>
      }
      {
        label !== undefined &&
        <div className='label'>{label}</div>
      }
    </Wrapper>
  );
}

export default Account;