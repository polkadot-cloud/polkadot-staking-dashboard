// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { Button } from 'library/Button';
import { useEffect, useState } from 'react';
import { isNumeric } from 'Utils';
import { BondInputProps } from '../types';
import { InputWrapper, RowWrapper } from '../Wrappers';

export const BondInput = (props: BondInputProps) => {
  const { disabled, freeBalance } = props;
  const setters = props.setters ?? [];
  const _value = props.value ?? 0;
  const disableTxFeeUpdate = props.disableTxFeeUpdate ?? false;

  const { network } = useApi();
  const { activeAccount } = useConnect();

  // the current local bond value
  const [value, setValue] = useState(_value);

  // reset value to default when changing account
  useEffect(() => {
    setValue(props.defaultValue ?? 0);
  }, [activeAccount]);

  useEffect(() => {
    if (!disableTxFeeUpdate) {
      setValue(_value.toString());
    }
  }, [_value]);

  // handle change for bonding
  const handleChangeBond = (e: any) => {
    const val = e.target.value;
    if (!isNumeric(val) && val !== '') {
      return;
    }
    setValue(val);
    updateParentState(val);
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
    <RowWrapper>
      <div>
        <InputWrapper>
          <section style={{ opacity: disabled ? 0.5 : 1 }}>
            <h3>Bond {network.unit}:</h3>
            <input
              type="text"
              placeholder={`0 ${network.unit}`}
              value={value}
              onChange={(e) => {
                handleChangeBond(e);
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
            title="Max"
            onClick={() => {
              setValue(freeBalance);
              updateParentState(freeBalance);
            }}
          />
        </div>
      </div>
    </RowWrapper>
  );
};

export default BondInput;
