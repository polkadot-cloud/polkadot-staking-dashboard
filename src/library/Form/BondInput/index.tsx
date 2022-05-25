// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { InputWrapper, RowWrapper } from './Wrappers';
import { useApi } from '../../../contexts/Api';
import { useConnect } from '../../../contexts/Connect';
import { useBalances } from '../../../contexts/Balances';
import { isNumeric, planckBnToUnit } from '../../../Utils';
import { Button } from '../../Button';
import { useStaking } from '../../../contexts/Staking';
import { APIContextInterface } from '../../../types/api';

export const BondInput = (props: any) => {
  // functional props
  const setters = props.setters ?? [];

  // input props
  const { disabled } = props;

  // whether to bond or unbond
  const task = props.task ?? 'bond';

  // whether a value has been provided already
  const _value = props.value ?? null;

  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { activeAccount } = useConnect();
  const { staking } = useStaking();
  const { minNominatorBond } = staking;
  const { getBondOptions }: any = useBalances();
  const { freeToBond, freeToUnbond } = getBondOptions(activeAccount);

  // unbond amount to `minNominatorBond` threshold
  const freeToUnbondToMinNominatorBond = Math.max(
    freeToUnbond - planckBnToUnit(minNominatorBond, units),
    0
  );

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
  const handleChangeUnbond = (e: any) => {
    const { value } = e.target;
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
              const value =
                task === 'bond' ? freeToBond : freeToUnbondToMinNominatorBond;
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
