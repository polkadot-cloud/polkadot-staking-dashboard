// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clipAddress, remToUnit } from '@polkadot-cloud/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { PolkadotIcon } from '@polkadot-cloud/react';
import { useTheme } from 'contexts/Themes';
import { Wrapper } from './Wrapper';
import type { AccountProps } from './types';

export const Account = ({
  fontSize = '1.05rem',
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
  const { mode } = useTheme();

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
    <Wrapper onClick={onClick} $canClick={canClick} $fontSize={fontSize}>
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
              <PolkadotIcon
                dark={mode === 'dark'}
                nocopy
                address={value}
                size={remToUnit(fontSize) * 1.4}
              />
            </span>
          )}
          <span className="title">{displayValue}</span>
        </>
      )}
    </Wrapper>
  );
};
