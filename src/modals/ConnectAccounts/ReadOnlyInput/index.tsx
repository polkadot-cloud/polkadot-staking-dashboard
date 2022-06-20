// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import Button from 'library/Button';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface, ImportedAccount } from 'types/connect';
import { isValidAddress } from 'Utils';
import { Wrapper } from './Wrapper';

export const ReadOnlyInput = () => {
  const { fetchAccountValid, accounts, addExternalAccount } =
    useConnect() as ConnectContextInterface;

  const [value, setValue] = useState('');

  const [valid, setValid] = useState<string | null>(null);

  const handleChange = async (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;

    // set value
    setValue(newValue);

    // check empty value
    if (newValue === '') {
      setValid(null);
      return;
    }
    // check already imported
    const alreadyImported = accounts.find(
      (a: ImportedAccount) => a.address === newValue
    );
    if (alreadyImported !== undefined) {
      setValid('already_imported');
      return;
    }
    // check if valid
    let _valid = 'not_valid';
    if (isValidAddress(newValue)) {
      const isValid = await fetchAccountValid(newValue);
      _valid = isValid ? 'valid' : 'not_valid';
    }
    setValid(_valid);
  };

  const handleImport = () => {
    // add as external account
    addExternalAccount(value, 'user');

    // reset state
    setValue('');
    setValid(null);
  };

  let label;
  let labelClass;
  switch (valid) {
    case 'already_imported':
      label = 'Address Already Imported';
      labelClass = 'danger';
      break;
    case 'not_valid':
      label = 'Address Invalid';
      labelClass = 'danger';
      break;
    case 'valid':
      label = 'Valid Address';
      labelClass = 'success';
      break;
    default:
      label = 'Input Address';
      labelClass = 'neutral';
  }

  return (
    <Wrapper>
      <h5 className={labelClass}>{label}</h5>
      <div className="input">
        <section>
          <input
            placeholder="Address"
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
            value={value}
          />
        </section>
        <section>
          <Button
            inline
            onClick={() => handleImport()}
            title="Import"
            disabled={valid !== 'valid'}
          />
        </section>
      </div>
    </Wrapper>
  );
};

export default ReadOnlyInput;
