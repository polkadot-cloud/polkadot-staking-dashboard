// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { Button } from 'library/Button';
import React, { useEffect, useState } from 'react';
import { isNumeric } from 'Utils';
import { UnbondInputProps } from '../types';
import { InputWrapper } from '../Wrappers';

export const UnbondInput = (props: UnbondInputProps) => {
  const { network } = useApi();
  const { activeAccount } = useConnect();

  const { disabled, freeToUnbondToMin } = props;
  const setters = props.setters ?? [];
  const _value = props.value ?? 0;
  const defaultValue = props.defaultValue ?? 0;

  // the current local bond value
  const [value, setValue] = useState(_value);

  // reset value to default when changing account
  useEffect(() => {
    setValue(defaultValue ?? 0);
  }, [activeAccount]);

  // handle change for unbonding
  const handleChangeUnbond = (e: React.ChangeEvent) => {
    if (!e) return;
    const element = e.currentTarget as HTMLInputElement;
    const val = element.value;

    if (!(!isNumeric(val) && val !== '')) {
      setValue(val);
      updateParentState(val);
    }
  };

  // apply bond to parent setters
  const updateParentState = (val: any) => {
    for (const s of setters) {
      s.set({
        ...s.current,
        bond: val,
      });
    }
  };

  return (
    <InputWrapper>
      <h3>Unbond {network.unit}:</h3>
      <div className="inner">
        <section style={{ opacity: disabled ? 0.5 : 1 }}>
          <div className="input">
            <input
              type="text"
              placeholder={`0 ${network.unit}`}
              value={value}
              onChange={(e) => {
                handleChangeUnbond(e);
              }}
              disabled={disabled}
            />
          </div>
        </section>
        <section>
          <Button
            inline
            title="Max"
            onClick={() => {
              setValue(freeToUnbondToMin);
              updateParentState(freeToUnbondToMin);
            }}
          />
        </section>
      </div>
    </InputWrapper>
  );
};
