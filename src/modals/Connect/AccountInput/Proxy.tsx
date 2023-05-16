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

  // Store current delegator value.
  const [delegator, setDelegator] = useState('');

  // store whether delegator input value is valid.
  const [delegatorValid, setDelegatorValid] = useState<string | null>(null);

  // handle setters for value updates
  const handleSetValue = (newValue: string) => {
    setDelegator(newValue);
  };
  // store whether address was formatted (displays confirm prompt)
  const [reformatted, setReformatted] = useState(false);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;

    // set value on key change
    handleSetValue(newValue);

    // reset reformatted if true - value has changed
    if (reformatted) {
      setReformatted(false);
    }

    // reset valid if empty value
    if (newValue === '') {
      setDelegatorValid(null);
      return;
    }
    // check address already imported
    const alreadyImported = accounts.find(
      (a) => a.address.toUpperCase() === newValue.toUpperCase()
    );
    if (alreadyImported !== undefined) {
      setDelegatorValid('already_imported');
      return;
    }
    // check if valid address
    setDelegatorValid(isValidAddress(newValue) ? 'valid' : 'not_valid');
  };

  const handleImport = async () => {
    // reformat address if in wrong format
    const reformattedDelegator = formatAccountSs58(delegator);

    // handle reformatted addresses.
    if (reformattedDelegator) {
      setReformatted(true);
      setDelegatorValid('confirm_reformat');
      handleSetValue(reformattedDelegator);

      return;
    }

    // handle successful import.
    const result = await successCallback(delegator);

    // reset state on successful import.
    if (result) {
      setReformatted(false);
      handleSetValue('');
      setDelegatorValid(null);
      setResize();
    } else {
      // TODO: error callbacks.
    }
  };

  const getInputLabel = () => {
    let label;
    let labelClass;

    switch (delegatorValid) {
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
        label = 'Input Delegator Address';
        labelClass = 'neutral';
    }

    return {
      label,
      labelClass,
    };
  };

  const handleConfirm = () => {
    setDelegatorValid('valid');
    setReformatted(false);
    handleImport();
  };

  return (
    <AccountInputWrapper>
      <h5 className={getInputLabel().labelClass}>{getInputLabel().label}</h5>
      <div className="input">
        <section>
          <input
            placeholder="Address"
            type="text"
            onChange={(e) => handleChange(e)}
            value={delegator}
          />
        </section>
        <section>
          {!reformatted ? (
            <ButtonSecondary
              onClick={() => handleImport()}
              text={t('import')}
              disabled={delegatorValid !== 'valid'}
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
