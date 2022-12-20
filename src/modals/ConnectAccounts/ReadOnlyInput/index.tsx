// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { ImportedAccount } from 'contexts/Connect/types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidAddress } from 'Utils';
import { Wrapper } from './Wrapper';

export const ReadOnlyInput = () => {
  const { formatAccountSs58, accounts, addExternalAccount } = useConnect();
  const { t } = useTranslation('modals');

  // store current input value
  const [value, setValue] = useState('');

  // store whether current input value is valid
  const [valid, setValid] = useState<string | null>(null);

  // store whether address was formatted (displays confirm prompt)
  const [reformatted, setReformatted] = useState(false);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    // set value on key change
    setValue(newValue);

    // reset reformatted if true - value has changed
    if (reformatted) {
      setReformatted(false);
    }

    // reset valid if empty value
    if (newValue === '') {
      setValid(null);
      return;
    }
    // check address already imported
    const alreadyImported = accounts.find(
      (a: ImportedAccount) => a.address.toUpperCase() === newValue.toUpperCase()
    );
    if (alreadyImported !== undefined) {
      setValid('already_imported');
      return;
    }
    // check if valid address
    setValid(isValidAddress(newValue) ? 'valid' : 'not_valid');
  };

  const handleImport = () => {
    // reformat address if in wrong format
    const addressFormatted = formatAccountSs58(value);
    if (addressFormatted) {
      setValid('confirm_reformat');
      setValue(addressFormatted);
      setReformatted(true);
    } else {
      // add as external account
      addExternalAccount(value, 'user');
      // reset state
      setReformatted(false);
      setValue('');
      setValid(null);
    }
  };

  let label;
  let labelClass;
  switch (valid) {
    case 'confirm_reformat':
      label = t('confirmReformat');
      labelClass = 'neutral';

      break;
    case 'already_imported':
      label = t('alreadyImported');
      labelClass = 'danger';
      break;
    case 'not_valid':
      label = t('invalid');
      labelClass = 'danger';
      break;
    case 'valid':
      label = t('valid');
      labelClass = 'success';
      break;
    default:
      label = t('inputAddress');
      labelClass = 'neutral';
  }

  const handleConfirm = () => {
    setValid('valid');
    setReformatted(false);
    handleImport();
  };

  return (
    <Wrapper>
      <h5 className={labelClass}>{label}</h5>
      <div className="input">
        <section>
          <input
            placeholder={t('address') || ''}
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
            value={value}
          />
        </section>
        <section>
          {!reformatted ? (
            <ButtonSecondary
              onClick={() => handleImport()}
              text={t('import')}
              disabled={valid !== 'valid'}
            />
          ) : (
            <ButtonSecondary
              onClick={() => handleConfirm()}
              text={t('confirm')}
            />
          )}
        </section>
      </div>
    </Wrapper>
  );
};

export default ReadOnlyInput;
