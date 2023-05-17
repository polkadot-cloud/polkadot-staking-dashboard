// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonSecondary } from '@polkadotcloud/core-ui';
import { isValidAddress } from '@polkadotcloud/utils';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountInputWrapper } from './Wrapper';
import type { AccountInputProps } from './types';

export const AccountInput = ({
  successCallback,
  defaultLabel,
}: AccountInputProps) => {
  const { t } = useTranslation('modals');

  const { formatAccountSs58, accounts } = useConnect();
  const { setResize } = useModal();

  // store current input value
  const [value, setValue] = useState('');

  // store whether current input value is valid
  const [valid, setValid] = useState<string | null>(null);

  // store whether address was formatted (displays confirm prompt)
  const [reformatted, setReformatted] = useState(false);

  // store whether the form is being submitted.
  const [submitting, setSubmitting] = useState<boolean>(false);

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
      (a) => a.address.toUpperCase() === newValue.toUpperCase()
    );
    if (alreadyImported !== undefined) {
      setValid('already_imported');
      return;
    }
    // check if valid address
    setValid(isValidAddress(newValue) ? 'valid' : 'not_valid');
  };

  const handleImport = async () => {
    // reformat address if in wrong format
    const addressFormatted = formatAccountSs58(value);
    if (addressFormatted) {
      setValid('confirm_reformat');
      setValue(addressFormatted);
      setReformatted(true);
    } else {
      // handle successful import.
      setSubmitting(true);
      const result = await successCallback(value);
      setSubmitting(false);

      // reset state on successful import.
      if (result) {
        setReformatted(false);
        setValue('');
        setValid(null);
        setResize();
      } else {
        // TODO: error callbacks.
      }
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
      label = defaultLabel;
      labelClass = 'neutral';
  }

  const handleConfirm = () => {
    setValid('valid');
    setReformatted(false);
    handleImport();
  };

  return (
    <AccountInputWrapper>
      <h5 className={labelClass}>{label}</h5>
      <div className="input">
        <section>
          <input
            placeholder={`${t('address')}`}
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
            value={value}
          />
        </section>
        <section>
          {!reformatted ? (
            <ButtonSecondary
              onClick={() => handleImport()}
              text={submitting ? 'Importing' : t('import')}
              disabled={valid !== 'valid' || submitting}
            />
          ) : (
            <ButtonSecondary
              onClick={() => handleConfirm()}
              text={t('confirm')}
            />
          )}
        </section>
      </div>
    </AccountInputWrapper>
  );
};
