// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Identicon from '@polkadot/react-identicon';
import Wrapper from './Wrapper';
import { clipAddress, convertRemToPixels } from '../../Utils';
import { useConnect } from '../../contexts/Connect';

export const Account = (props: any) => {

  const { getAccount } = useConnect();

  // data props
  let { value, label }: any = props;

  // presentational props
  let { format }: any = props;
  let filled = props.filled ?? false;
  let fontSize = props.fontSize ?? '1rem';
  let padding = props.padding ?? '0 0.35rem';

  // functional props
  let { canClick }: { canClick: boolean } = props;

  let unassigned = value === null || value === undefined;

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
      fill={filled ? 'rgba(237, 237, 237, 0.5)' : 'none'}
      fontSize={fontSize}
      padding={padding}
    >
      {unassigned &&
        <span className='title unassigned'>Not Set</span>
      }
      {unassigned !== true &&
        <>
          <Identicon
            value={value}
            size={convertRemToPixels(fontSize) * 1.35}
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