// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Polkicon } from '@w3ux/react-polkicon';
import { isValidAddress } from '@w3ux/utils';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useNetwork } from 'contexts/Network';
import { formatAccountSs58 } from 'contexts/Connect/Utils';
import { AccountInputWrapper } from './Wrapper';
import type { AccountInputProps } from './types';
import { ButtonSecondary } from 'kits/Buttons/ButtonSecondary';

export const AccountInput = ({
  successCallback,
  resetCallback,
  defaultLabel,
  resetOnSuccess = false,
  successLabel,
  locked = false,
  inactive = false,
  disallowAlreadyImported = true,
  initialValue = null,
  border = true,
}: AccountInputProps) => {
  const { t } = useTranslation('library');

  const {
    networkData: { ss58 },
  } = useNetwork();
  const { accounts } = useImportedAccounts();
  const { setModalResize } = useOverlay().modal;

  // store current input value
  const [value, setValue] = useState<string>(initialValue || '');

  // store whether current input value is valid
  const [valid, setValid] = useState<string | null>(null);

  // store whether address was formatted (displays confirm prompt)
  const [reformatted, setReformatted] = useState<boolean>(false);

  // store whether the form is being submitted.
  const [submitting, setSubmitting] = useState<boolean>(false);

  // store whether account input is in success lock state.
  const [successLock, setSuccessLocked] = useState<boolean>(locked);

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
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
    if (alreadyImported !== undefined && disallowAlreadyImported) {
      setValid('already_imported');
      return;
    }
    // check if valid address
    setValid(isValidAddress(newValue) ? 'valid' : 'not_valid');
  };

  const handleImport = async () => {
    // reformat address if in wrong format
    const addressFormatted = formatAccountSs58(value, ss58);
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
      if (result && resetOnSuccess) {
        resetInput();
      } else {
        // flag reset & lock state.
        setSuccessLocked(true);
      }
    }
  };

  // If initial value changes, update current input value.
  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  let label;
  let labelClass;
  const showSuccess = successLock && successLabel;

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
      label = showSuccess ? successLabel : t('valid');
      labelClass = showSuccess ? 'neutral' : 'success';
      break;
    default:
      label = showSuccess ? successLabel : defaultLabel;
      labelClass = 'neutral';
      break;
  }

  const handleConfirm = () => {
    setValid('valid');
    setReformatted(false);
    handleImport();
  };

  const resetInput = () => {
    setReformatted(false);
    setValue('');
    setValid(null);
    setModalResize();
    setSuccessLocked(false);
    if (resetCallback) {
      resetCallback();
    }
  };

  const className = [];
  if (inactive) {
    className.push('inactive');
  }
  if (border) {
    className.push('border');
  }

  return (
    <AccountInputWrapper
      className={className.length ? className.join(' ') : undefined}
    >
      {inactive && <div className="inactive-block" />}
      <h5 className={labelClass}>
        {successLock && (
          <>
            <FontAwesomeIcon icon={faCheck} />
            &nbsp;
          </>
        )}{' '}
        {label}
      </h5>
      <div className={`input${successLock ? ` disabled` : ``}`}>
        <section>
          <div>
            {isValidAddress(value) ? (
              <Polkicon address={value} size="2rem" />
            ) : (
              <div className="ph" />
            )}
          </div>
          <div>
            <input
              placeholder={t('address')}
              type="text"
              onChange={(e: FormEvent<HTMLInputElement>) => handleChange(e)}
              value={value}
              disabled={successLock}
            />
          </div>
        </section>
        <section>
          {successLock ? (
            <ButtonSecondary onClick={() => resetInput()} text={t('reset')} />
          ) : !reformatted ? (
            <ButtonSecondary
              onClick={() => handleImport()}
              text={submitting ? t('importing') : t('import')}
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
