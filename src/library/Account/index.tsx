// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clipAddress } from '@polkadotcloud/utils';
import { useConnect } from 'contexts/Connect';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Identicon } from '../Identicon';
import { Wrapper } from './Wrapper';
import type { AccountProps } from './types';

export const Account = ({
  filled = false,
  fontSize = 'var(--button-font-size-small)',
  format,
  value,
  label,
  readOnly,
  canClick,
  title,
  onClick,
}: AccountProps) => {
  const { t } = useTranslation('library');
  const { getAccount } = useConnect();

  const [displayValue, setDisplayValue] = useState<string | undefined>();

  const unassigned = value === null || value === undefined || !value.length;

  useEffect(() => {
    // format value based on `format` prop
    switch (format) {
      case 'name':
        setDisplayValue(
          value !== ''
            ? getAccount(value)?.name || clipAddress(value)
            : clipAddress(value)
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
      onClick={onClick}
      canClick={canClick}
      filled={filled}
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
        <span className="title unassigned">{t('notStaking')}</span>
      ) : (
        <>
          {format !== 'text' && (
            <span className="identicon">
              <Identicon value={value} size={18} />
            </span>
          )}
          <span className="title">{displayValue}</span>
        </>
      )}
    </Wrapper>
  );
};
