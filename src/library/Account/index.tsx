// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
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
  const { value, label }: any = props;

  // presentational props
  const { format }: any = props;
  const filled = props.filled ?? false;
  const fontSize = props.fontSize ?? '1rem';
  const wallet = props.wallet ?? false;

  // functional props
  const { canClick }: { canClick: boolean } = props;

  const unassigned = value === null || value === undefined || !value.length;

  // format value based on `format` prop
  let displayValue;
  switch (format) {
    case 'name':
      if (value !== '') {
        displayValue = getAccount(value)?.meta?.name;
      } else {
        displayValue = clipAddress(value);
      }
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
      cursor={canClick ? 'pointer' : 'default'}
      fill={filled ? defaultThemes.buttons.secondary.background[mode] : 'none'}
      fontSize={fontSize}
    >
      {label !== undefined && <div className="account-label">{label}</div>}

      {unassigned ? (
        <span className="title unassigned">Not Set</span>
      ) : (
        <>
          <span className="identicon">
            <Identicon
              value={value}
              size={convertRemToPixels(fontSize) * 1.45}
            />
          </span>
          <span className="title">{displayValue}</span>
        </>
      )}

      {wallet && (
        <div className="wallet">
          <WalletSVG />
        </div>
      )}
    </Wrapper>
  );
};

export default Account;
