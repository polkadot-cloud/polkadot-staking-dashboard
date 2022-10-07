// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useConnect } from 'contexts/Connect';
import { isValidAddress } from 'Utils';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './Wrapper';

export const RoleEditInput = ({ setRoleEdit, roleKey, roleEdit }: any) => {
  const { formatAccountSs58 } = useConnect();
  const { t } = useTranslation('common');

  const processRoleEdit = (newAddress: string) => {
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
    const edit = processRoleEdit(newValue);
    setRoleEdit(roleKey, edit);
  };

  let label;
  let labelClass;
  if (!roleEdit?.valid) {
    label = t('pages.pools.address_invalid');
    labelClass = 'danger';
  } else if (roleEdit?.reformatted) {
    label = t('pages.pools.reformatted');
    labelClass = 'neutral';
  }

  return (
    <Wrapper>
      <div className="input">
        <section>
          <input
            placeholder={t('pages.pools.address')}
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
