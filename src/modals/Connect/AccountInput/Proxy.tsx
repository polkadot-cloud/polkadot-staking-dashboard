// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonSecondary } from '@polkadotcloud/core-ui';
import { isValidAddress } from '@polkadotcloud/utils';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountInputWrapper } from './Wrapper';
import type { ProxyInputProps } from './types';

export const ProxyInput = ({ successCallback }: ProxyInputProps) => {
  const { t } = useTranslation('modals');

  const { formatAccountSs58, accounts } = useConnect();
  const { setResize } = useModal();

  // Store current delegate value.
  const [delegate, setDelegate] = useState('');

  // Store current delegator value.
  const [delegator, setDelegator] = useState('');

  // store whether delegate input value is valid.
  const [delegateValid, setDelegateValid] = useState<string | null>(null);

  // store whether delegator input value is valid.
  const [delegatorValid, setDelegatorValid] = useState<string | null>(null);

  // handle setters for value updates
  const handleSetValue = (field: string, newValue: string) => {
    if (field === 'delegate') {
      setDelegate(newValue);
    } else {
      setDelegator(newValue);
    }
  };
  // store whether address was formatted (displays confirm prompt)
  const [reformatted, setReformatted] = useState(false);

  const handleChange = (
    e: React.FormEvent<HTMLInputElement>,
    field: 'delegate' | 'delegator'
  ) => {
    const newValue = e.currentTarget.value;

    // set value on key change
    handleSetValue(field, newValue);

    // reset reformatted if true - value has changed
    if (reformatted) {
      setReformatted(false);
    }

    // reset valid if empty value
    if (newValue === '') {
      if (field === 'delegate') {
        setDelegateValid(null);
      } else {
        setDelegatorValid(null);
      }
      return;
    }
    // check address already imported
    const alreadyImported = accounts.find(
      (a) => a.address.toUpperCase() === newValue.toUpperCase()
    );
    if (alreadyImported !== undefined) {
      if (field === 'delegate') {
        setDelegateValid('already_imported');
      } else {
        setDelegatorValid('already_imported');
      }
      return;
    }
    // check if valid address
    if (field === 'delegate') {
      setDelegateValid(isValidAddress(newValue) ? 'valid' : 'not_valid');
    } else {
      setDelegatorValid(isValidAddress(newValue) ? 'valid' : 'not_valid');
    }
  };

  const handleImport = async () => {
    // reformat address if in wrong format
    const reformattedDelegate = formatAccountSs58(delegate);
    const reformattedDelegator = formatAccountSs58(delegator);

    // handle reformatted addresses.
    if (reformattedDelegate || reformattedDelegator) {
      setReformatted(true);

      if (reformattedDelegate) {
        setDelegateValid('confirm_reformat');
        handleSetValue('delegate', reformattedDelegate);
      }
      if (reformattedDelegator) {
        setDelegatorValid('confirm_reformat');
        handleSetValue('delegator', reformattedDelegator);
      }
      return;
    }

    // handle successful import.
    const result = await successCallback(delegate, delegator);

    // reset state on successful import.
    if (result) {
      setReformatted(false);
      handleSetValue('delegate', '');
      handleSetValue('delegator', '');
      setDelegateValid(null);
      setDelegatorValid(null);
      setResize();
    } else {
      // TODO: error callbacks.
    }
  };

  const getInputLabel = (field: 'delegate' | 'delegator') => {
    let label;
    let labelClass;
    const valid = field === 'delegate' ? delegateValid : delegatorValid;

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
        label =
          field === 'delegate'
            ? 'Input Delegate Address'
            : 'Input Delegator Address';
        labelClass = 'neutral';
    }

    return {
      label,
      labelClass,
    };
  };

  const handleConfirm = () => {
    setDelegateValid('valid');
    setDelegatorValid('valid');
    setReformatted(false);
    handleImport();
  };

  return (
    <AccountInputWrapper>
      <h5 className={getInputLabel('delegate').labelClass}>
        {getInputLabel('delegate').label}
      </h5>
      <div className="input">
        <section>
          <input
            placeholder="Address"
            type="text"
            onChange={(e) => handleChange(e, 'delegate')}
            value={delegate}
          />
        </section>
      </div>

      <h5 className={getInputLabel('delegator').labelClass}>
        {getInputLabel('delegator').label}
      </h5>
      <div className="input">
        <section>
          <input
            placeholder="Address"
            type="text"
            onChange={(e) => handleChange(e, 'delegator')}
            value={delegator}
          />
        </section>
      </div>

      <div className="submit">
        {!reformatted ? (
          <ButtonSecondary
            onClick={() => handleImport()}
            text={t('import')}
            disabled={delegateValid !== 'valid' || delegatorValid !== 'valid'}
          />
        ) : (
          <ButtonSecondary
            onClick={() => handleConfirm()}
            text={t('confirm')}
          />
        )}
      </div>
    </AccountInputWrapper>
  );
};
