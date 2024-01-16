// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isValidAddress } from '@polkadot-cloud/utils';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNetwork } from 'contexts/Network';
import { formatAccountSs58 } from 'contexts/Connect/Utils';
import { Wrapper } from './Wrapper';
import type { RoleEditInputProps } from '../types';

export const RoleEditInput = ({
  setRoleEdit,
  roleKey,
  roleEdit,
}: RoleEditInputProps) => {
  const { t } = useTranslation('pages');
  const {
    networkData: { ss58 },
  } = useNetwork();

  const processRoleEdit = (newAddress: string) => {
    let edit = {
      newAddress,
      valid: newAddress === '', // empty address is valid and removes the role
      reformatted: false,
    };
    if (isValidAddress(newAddress)) {
      const addressFormatted = formatAccountSs58(newAddress, ss58);
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

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    // set value on key change
    const edit = processRoleEdit(newValue);
    setRoleEdit(roleKey, edit);
  };

  let label;
  let labelClass;
  if (!roleEdit?.valid) {
    label = t('pools.addressInvalid');
    labelClass = 'danger';
  } else if (roleEdit?.reformatted) {
    label = t('pools.reformatted');
    labelClass = 'neutral';
  }

  return (
    <Wrapper>
      <div className="input">
        <section>
          <input
            placeholder={t('pools.address')}
            type="text"
            onChange={(e: FormEvent<HTMLInputElement>) => handleChange(e)}
            value={roleEdit?.newAddress ?? ''}
          />
        </section>
      </div>
      {label && <h5 className={labelClass}>{label}</h5>}
    </Wrapper>
  );
};
