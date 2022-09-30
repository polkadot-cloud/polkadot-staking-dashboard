// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { clipAddress, convertRemToPixels } from 'Utils';
import { useConnect } from 'contexts/Connect';
import { useTheme } from 'contexts/Themes';
import { defaultThemes } from 'theme/default';
import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import Wrapper from './Wrapper';
import Identicon from '../Identicon';
import { AccountProps } from './types';

export const Account = (props: AccountProps) => {
  const { mode } = useTheme();
  const { getAccount } = useConnect();
  const { t } = useTranslation('common');

  // data props
  const { value, label, readOnly } = props;

  // presentational props
  const { format } = props;
  const filled = props.filled ?? false;
  const fontSize = props.fontSize ?? '1.05rem';

  // functional props
  const { canClick }: { canClick: boolean } = props;

  const unassigned = value === null || value === undefined || !value.length;

  // format value based on `format` prop
  let displayValue;
  switch (format) {
    case 'name':
      if (value !== '') {
        displayValue = getAccount(value)?.name;
      } else {
        displayValue = clipAddress(value);
      }
      break;
    case 'text':
      displayValue = value;
      break;
    default:
      if (value) {
        displayValue = clipAddress(value);
      }
  }

  // if title prop is provided, override `displayValue`
  if (props.title !== undefined) {
    displayValue = props.title;
  }

  return (
    <Wrapper
      whileHover={{ scale: 1.01 }}
      onClick={props.onClick}
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
        <span className="title unassigned">{t('library.not_staking')}</span>
      ) : (
        <>
          {format !== 'text' && (
            <span className="identicon">
              <Identicon
                value={value}
                size={convertRemToPixels(fontSize) * 1.4}
              />
            </span>
          )}
          <span className="title">{displayValue || clipAddress(value)}</span>
        </>
      )}
    </Wrapper>
  );
};

export default Account;
