// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { useTheme } from 'contexts/Themes';
import { useEffect, useState } from 'react';
import { defaultThemes } from 'theme/default';
import { clipAddress, remToUnit } from 'Utils';
import Identicon from '../Identicon';
import { AccountProps } from './types';
import Wrapper from './Wrapper';

export const Account = ({
  filled = false,
  fontSize = '1.05rem',
  format,
  value,
  label,
  readOnly,
  canClick,
  title,
  onClick,
}: AccountProps) => {
  const { mode } = useTheme();
  const { getAccount } = useConnect();
  const [displayValue, setDisplayValue] = useState<string | undefined>();

  const unassigned = value === null || value === undefined || !value.length;

  useEffect(() => {
    // format value based on `format` prop
    switch (format) {
      case 'name':
        setDisplayValue(
          value !== '' ? getAccount(value)?.name : clipAddress(value)
        );
        break;
      case 'text':
        setDisplayValue(value);
        break;
      default:
        if (value) setDisplayValue(clipAddress(value));
    }

    // if title prop is provided, override `displayValue`
    if (title !== undefined) setDisplayValue(title);
  }, [value, title]);

  return (
    <Wrapper
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      cursor={canClick ? 'pointer' : 'default'}
      fill={filled ? defaultThemes.buttons.secondary.background[mode] : 'none'}
      fontSize={fontSize}
    >
      {label !== undefined && (
        <div className="account-label">
          {label}{' '}
          {readOnly && (
            <>
              &nbsp;
              <FontAwesomeIcon icon={faGlasses} />
            </>
          )}
        </div>
      )}

      {unassigned ? (
        <span className="title unassigned">Not Staking</span>
      ) : (
        <>
          {format !== 'text' && (
            <span className="identicon">
              <Identicon value={value} size={remToUnit(fontSize) * 1.4} />
            </span>
          )}
          <span className="title">{displayValue}</span>
        </>
      )}
    </Wrapper>
  );
};

export default Account;
