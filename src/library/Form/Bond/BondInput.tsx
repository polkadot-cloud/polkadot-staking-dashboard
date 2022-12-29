// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonInvert } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('library');

  // the current local bond value
  const [localBond, setLocalBond] = useState<string>(_value);

  // reset value to default when changing account
  useEffect(() => {
    setLocalBond(defaultValue ?? '0');
  }, [activeAccount]);

  useEffect(() => {
    if (!disableTxFeeUpd) {
      setLocalBond(_value.toString());
    }
  }, [_value]);

  // handle change for bonding
  const handleChangeBond = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value as string;
    // ensure the value is numeric before it is put into state.
    if (!isNumeric(val) && val !== '') {
      return;
    }
    setLocalBond(val);
    updateParentState(val);
  };

  // apply bond to parent setters
  const updateParentState = (val: string) => {
    for (const s of sets) {
      s.set({
        ...s.current,
        bond: val,
      });
    }
  };

  return (
    <InputWrapper>
      <h3>
        {t('bond')} {network.unit}:
      </h3>
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
                  : `${humanNumber(freeBalance)} ${network.unit} ${t(
                      'available'
                    )}`}
              </p>
            </div>
          </div>
        </section>
        <section>
          <ButtonInvert
            text={t('max')}
            disabled={disabled || syncing || freeBalance === 0}
            onClick={() => {
              setLocalBond(String(freeBalance));
              updateParentState(String(freeBalance));
            }}
          />
        </section>
      </div>
    </InputWrapper>
  );
};

export default BondInput;
