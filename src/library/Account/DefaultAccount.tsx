// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ellipsisFn, remToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { Polkicon } from '@polkadot-cloud/react';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { memo } from 'react';
import { Wrapper } from './Wrapper';
import type { AccountProps } from './types';

const DefaultAccount = ({ value, label, readOnly }: AccountProps) => {
  const { t } = useTranslation('library');
  const { getAccount } = useImportedAccounts();

  // Determine account display text. Title takes precedence over value.
  const text: string | null =
    value === null
      ? null
      : value !== ''
        ? getAccount(value)?.name || ellipsisFn(value)
        : ellipsisFn(value);

  return (
    <Wrapper>
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
      {text === null ? (
        <span className="title unassigned">{t('notStaking')}</span>
      ) : (
        <>
          <span className="identicon">
            <Polkicon address={value || ''} size={remToUnit('1.45rem')} />
          </span>
          <span className="title">{text}</span>
        </>
      )}
    </Wrapper>
  );
};

export default memo(DefaultAccount);
