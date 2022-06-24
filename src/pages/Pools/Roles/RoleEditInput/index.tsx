// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import Button from 'library/Button';
import { useConnect } from 'contexts/Connect';
import { ConnectContextInterface, ImportedAccount } from 'types/connect';
import { isValidAddress } from 'Utils';
import { Wrapper } from './Wrapper';

export const RoleEditInput = ({ setRoleEdit, roleEdit }: any) => {
  const { formatAccountSs58 } = useConnect() as ConnectContextInterface;
  const getRoleEdit = (newAddress: string) => {
    let edit = {
      newAddress,
      valid: newAddress === '', // empty address is valid and removes the role
      reformatted: false,
    };
    if (isValidAddress(newAddress)) {
      const addressFormatted = formatAccountSs58(newAddress);
      if (addressFormatted) {
        edit = {
          newAddress: addressFormatted,
          valid: true,
          reformatted: true,
        };
      } else {
        edit = { newAddress, valid: true, reformatted: false };
      }
    }
    return { ...roleEdit, ...edit };
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    // set value on key change
    const edit = getRoleEdit(newValue);
    setRoleEdit(edit);
  };

  let label;
  let labelClass;
  if (!roleEdit?.valid) {
    label = 'Address Invalid';
    labelClass = 'danger';
  } else if (roleEdit?.reformatted) {
    label = 'Address was reformatted';
    labelClass = 'neutral';
  }

  return (
    <Wrapper>
      <div className="input">
        <section>
          <input
            placeholder="Address"
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
            value={roleEdit?.newAddress}
          />
        </section>
      </div>
      {label && <h5 className={labelClass}>{label}</h5>}
    </Wrapper>
  );
};

export default RoleEditInput;
