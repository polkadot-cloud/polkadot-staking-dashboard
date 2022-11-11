// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { Button } from 'library/Button';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isNumeric } from 'Utils';
import { BondInputProps } from '../types';
import { InputWrapper, RowWrapper } from '../Wrappers';

export const BondInput = ({
  setters,
  disabled,
  defaultValue,
  freeBalance,
  disableTxFeeUpdate,
  value,
}: BondInputProps) => {
  const sets = setters ?? [];
  const _value = value ?? 0;
  const disableTxFeeUpd = disableTxFeeUpdate ?? false;
  const { t } = useTranslation('common');

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
    <RowWrapper>
      <div>
        <InputWrapper>
          <section style={{ opacity: disabled ? 0.5 : 1 }}>
            <h3>
              {t('library.bond')} {network.unit}:
            </h3>
            <input
              type="text"
              placeholder={`0 ${network.unit}`}
              value={localBond}
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
            title={t('library.max')}
            onClick={() => {
              setLocalBond(freeBalance);
              updateParentState(freeBalance);
            }}
          />
        </div>
      </div>
    </RowWrapper>
  );
};

export default BondInput;
