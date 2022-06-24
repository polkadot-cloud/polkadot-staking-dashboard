// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { isNumeric } from 'Utils';
import { Button } from 'library/Button';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { InputWrapper, RowWrapper } from './Wrappers';
import { BondInputProps } from '../types';

export const BondInput = (props: BondInputProps) => {
  // functional props
  const setters = props.setters ?? [];

  const { disabled, freeToBond, freeToUnbondToMin } = props;

  // whether to bond or unbond
  const task = props.task ?? 'bond';

  // whether a value has been provided already
  const _value = props.value ?? 0;

  const { network } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;

  // the current local bond value
  const [bond, setBond] = useState(_value);

  // handle change for bonding
  const handleChangeBond = (e: any) => {
    const { value } = e.target;
    if (!isNumeric(value) && value !== '') {
      return;
    }
    setBond(value);
    updateParentState(value);
  };

  // handle change for unbonding
  const handleChangeUnbond = (e: React.ChangeEvent) => {
    if (!e) return;

    const element = e.currentTarget as HTMLInputElement;
    const value = element.value;

    if (!isNumeric(value) && value !== '') {
      return;
    }
    setBond(value);
    updateParentState(value);
  };

  // apply bond to parent setters
  const updateParentState = (value: any) => {
    for (const s of setters) {
      s.set({
        ...s.current,
        bond: value,
      });
    }
  };

  // reset value to default when changing account
  useEffect(() => {
    setBond(props.defaultValue ?? 0);
  }, [activeAccount]);

  return (
    <RowWrapper>
      <div>
        <InputWrapper>
          <section style={{ opacity: disabled ? 0.5 : 1 }}>
            <h3>
              {task === 'unbond' ? 'Unbond' : 'Bond'} {network.unit}:
            </h3>
            <input
              type="text"
              placeholder={`0 ${network.unit}`}
              value={bond}
              onChange={(e) => {
                if (task === 'bond') {
                  handleChangeBond(e);
                } else {
                  handleChangeUnbond(e);
                }
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
              const value = task === 'bond' ? freeToBond : freeToUnbondToMin;
              setBond(value);
              updateParentState(value);
            }}
          />
        </div>
      </div>
    </RowWrapper>
  );
};

export default BondInput;
