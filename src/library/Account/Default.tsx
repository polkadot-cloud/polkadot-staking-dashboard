// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn } from '@polkadot-cloud/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { AccountCard } from '@polkadot-cloud/react';
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

  const [displayValue, setDisplayValue] = useState<string | undefined>();

  const unassigned = value === null || value === undefined || !value.length;

  useEffect(() => {
    // format value based on `format` prop
    switch (format) {
      case 'name':
        setDisplayValue(
          value !== ''
            ? getAccount(value)?.name || ellipsisFn(value)
            : ellipsisFn(value)
        );
        break;
      case 'text':
        setDisplayValue(value);
        break;
      default:
        if (value) setDisplayValue(ellipsisFn(value));
    }

    // if title prop is provided, override `displayValue`
    if (title !== undefined) setDisplayValue(title);
  }, [value, title]);

  return (
    <Wrapper onClick={onClick} $canClick={canClick} $fontSize={fontSize}>
      {unassigned ? (
        <span className="title unassigned">{t('notStaking')}</span>
      ) : (
        <AccountCard
          noCard
          fontSize="1.1rem"
          icon={{
            size: 15,
            gridSize: 1,
            justify: 'flex-start',
          }}
          extraComponent={{
            component:
              label !== undefined ? (
                <div className="account-label">
                  {label}{' '}
                  {readOnly && (
                    <>
                      &nbsp;
                      <FontAwesomeIcon icon={faGlasses} />
                    </>
                  )}
                </div>
              ) : undefined,
            gridSize: 4,
            style: { width: '10rem' },
          }}
          title={{
            address: value,
            name: displayValue || '',
            justify: 'flex-start',
            align: 'center',
          }}
        />
      )}
    </Wrapper>
  );
};
