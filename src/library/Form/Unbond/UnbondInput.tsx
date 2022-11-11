// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { Button } from 'library/Button';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isNumeric } from 'Utils';
import { UnbondInputProps } from '../types';
import { InputWrapper, RowWrapper } from '../Wrappers';

export const UnbondInput = ({
  defaultValue,
  disabled,
  freeToUnbondToMin,
  setters,
  value,
}: UnbondInputProps) => {
  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { t } = useTranslation('common');

  const sets = setters ?? [];
  const _value = value ?? 0;

  // the current local bond value
  const [localBond, setLocalBond] = useState(_value);

  // reset value to default when changing account
  useEffect(() => {
    setLocalBond(defaultValue ?? 0);
  }, [activeAccount]);

  // handle change for unbonding
  const handleChangeUnbond = (e: React.ChangeEvent) => {
    if (!e) return;
    const element = e.currentTarget as HTMLInputElement;
    const val = element.value;

    if (!(!isNumeric(val) && val !== '')) {
      setLocalBond(val);
      updateParentState(val);
    }
  };

  // apply bond to parent setters
  const updateParentState = (val: any) => {
    for (const s of sets) {
      s.set({
        ...s.current,
        bond: val,
      });
    }
  };

  return (
    <RowWrapper>
      <div>
        <InputWrapper>
          <section style={{ opacity: disabled ? 0.5 : 1 }}>
            <h3>
              {t('library.unbond')} {network.unit}:
            </h3>
            <input
              type="text"
              placeholder={`0 ${network.unit}`}
              value={localBond}
              onChange={(e) => {
                handleChangeUnbond(e);
              }}
              disabled={disabled}
            />
          </section>
        </InputWrapper>
      </div>
      <div>
        <div>
          <Button
            inline
            small
            title={t('library.max')}
            onClick={() => {
              setLocalBond(freeToUnbondToMin);
              updateParentState(freeToUnbondToMin);
            }}
          />
        </div>
      </div>
    </RowWrapper>
  );
};
