// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonInvert } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useEffect, useState } from 'react';
import { humanNumber, isNumeric } from 'Utils';
import { BondInputProps } from '../types';
import { InputWrapper } from '../Wrappers';

export const BondInput = ({
  setters,
  disabled,
  defaultValue,
  freeBalance,
  disableTxFeeUpdate,
  value,
  syncing = false,
}: BondInputProps) => {
  const sets = setters ?? [];
  const _value = value ?? 0;
  const disableTxFeeUpd = disableTxFeeUpdate ?? false;

  const { network } = useApi();
  const { activeAccount } = useConnect();

  // the current local bond value
  const [localBond, setLocalBond] = useState(_value);

  // reset value to default when changing account
  useEffect(() => {
    setLocalBond(defaultValue ?? 0);
  }, [activeAccount]);

  useEffect(() => {
    if (!disableTxFeeUpd) {
      setLocalBond(_value.toString());
    }
  }, [_value]);

  // handle change for bonding
  const handleChangeBond = (e: any) => {
    const val = e.target.value;
    if (!isNumeric(val) && val !== '') {
      return;
    }
    setLocalBond(val);
    updateParentState(val);
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
    <InputWrapper>
      <h3>Bond {network.unit}:</h3>
      <div className="inner">
        <section style={{ opacity: disabled ? 0.5 : 1 }}>
          <div className="input">
            <div>
              <input
                type="text"
                placeholder={`0 ${network.unit}`}
                value={localBond}
                onChange={(e) => {
                  handleChangeBond(e);
                }}
                disabled={disabled}
              />
            </div>
            <div>
              <p>
                {syncing
                  ? '...'
                  : `${humanNumber(freeBalance)} ${network.unit} available`}
              </p>
            </div>
          </div>
        </section>
        <section>
          <ButtonInvert
            text="Max"
            disabled={disabled || syncing || freeBalance === 0}
            onClick={() => {
              setLocalBond(freeBalance);
              updateParentState(freeBalance);
            }}
          />
        </section>
      </div>
    </InputWrapper>
  );
};

export default BondInput;
