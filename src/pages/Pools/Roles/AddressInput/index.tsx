// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import Button from 'library/Button';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface, ImportedAccount } from 'types/connect';
import { isValidAddress } from 'Utils';
import { Wrapper } from './Wrapper';

export const AddressInput = ({ address, setAddress }: any) => {
  const { formatAccountSs58 } = useConnect() as ConnectContextInterface;

  // store whether current input value is valid
  const [valid, setValid] = useState<string | null>(null);

  // store whether address was formatted (displays confirm prompt)
  const [reformatted, setReformatted] = useState(false);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    // set value on key change
    setAddress(newValue);

    // if address is valid reformat
    if (isValidAddress(newValue)) {
      const addressFormatted = formatAccountSs58(address);
      if (addressFormatted) {
        setValid('confirm_reformat');
        setAddress(addressFormatted);
        setReformatted(true);
      } else {
        setReformatted(false);
      }
    }

    // reset valid if empty value
    if (newValue === '') {
      setValid(null);
      return;
    }
    // check if valid address
    setValid(isValidAddress(newValue) ? 'valid' : 'not_valid');
  };

  let label;
  let labelClass;
  switch (valid) {
    case 'confirm_reformat':
      label = 'Address was reformatted. Please confirm.';
      labelClass = 'neutral';
      break;
    case 'not_valid':
      label = 'Address Invalid';
      labelClass = 'danger';
      break;
    default:
      label = '';
      labelClass = 'neutral';
  }

  const handleConfirm = () => {
    setValid('valid');
    setReformatted(false);
  };

  return (
    <Wrapper>
      <div className="input">
        <section>
          <input
            placeholder="Address"
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
            value={address}
          />
        </section>
        <section>
          {reformatted && (
            <Button inline onClick={() => handleConfirm()} title="Confirm" />
          )}
        </section>
        {label && <h5 className={labelClass}>{label}</h5>}
      </div>
    </Wrapper>
  );
};

export default AddressInput;
