// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Identicon from '../Identicon';
import Wrapper from './Wrapper';
import { clipAddress, convertRemToPixels } from '../../Utils';
import { useConnect } from '../../contexts/Connect';
import { useTheme } from '../../contexts/Themes';
import { defaultThemes } from '../../theme/default';
import { ReactComponent as WalletSVG } from '../../img/wallet.svg';

export const Account = (props: any) => {

  const { mode } = useTheme();
  const { getAccount } = useConnect();

  // data props
  let { value, label }: any = props;

  // presentational props
  let { format }: any = props;
  let filled = props.filled ?? false;
  let fontSize = props.fontSize ?? '1rem';
  let wallet = props.wallet ?? false;

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
      onClick={props.onClick}
      cursor={canClick ? `pointer` : `default`}
      fill={filled ? defaultThemes.buttons.secondary.background[mode] : 'none'}
      fontSize={fontSize}
    >
      {label !== undefined &&
        <div className='label'>
          {label}
        </div>
      }

      {unassigned
        ? <span className='title unassigned'>Not Set</span>
        :
        <>
          <span className='identicon'>
            <Identicon
              value={value}
              size={convertRemToPixels(fontSize) * 1.45}
            />
          </span>
          <span className='title'>{displayValue}</span>
        </>
      }

      {wallet &&
        <div className='wallet'>
          <WalletSVG />
        </div>
      }
    </Wrapper>
  );
}

export default Account;