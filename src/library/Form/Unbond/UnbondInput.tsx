// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmitInvert } from '@polkadot-cloud/react';
import { planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { InputWrapper } from '../Wrappers';
import type { UnbondInputProps } from '../types';

export const UnbondInput = ({
  defaultValue,
  disabled,
  unbondToMin,
  setters = [],
  value = 0,
  active,
}: UnbondInputProps) => {
  const { t } = useTranslation('library');
  const { networkData } = useNetwork();
  const { activeAccount } = useActiveAccounts();

  // get the actively bonded amount.
  const activeUnit = planckToUnit(active, networkData.units);

  // the current local bond value.
  const [localBond, setLocalBond] = useState(value);

  // reset value to default when changing account.
  useEffect(() => {
    setLocalBond(defaultValue ?? 0);
  }, [activeAccount]);

  // handle change for unbonding.
  const handleChangeUnbond = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (new BigNumber(val).isNaN() && val !== '') {
      return;
    }
    setLocalBond(val);
    updateParentState(val);
  };

  // apply bond to parent setters.
  const updateParentState = (val: any) => {
    for (const s of setters) {
      s.set({
        ...s.current,
        bond: val,
      });
    }
  };

  // unbond to min as unit.
  const unbondToMinUnit = planckToUnit(unbondToMin, networkData.units);

  // available funds as jsx.
  const maxBondedJsx = (
    <p>
      {activeUnit.toFormat()} {networkData.unit} {t('bonded')}
    </p>
  );

  return (
    <InputWrapper>
      <div className="inner">
        <section style={{ opacity: disabled ? 0.5 : 1 }}>
          <div className="input">
            <div>
              <input
                type="text"
                placeholder={`0 ${networkData.unit}`}
                value={localBond}
                onChange={(e) => {
                  handleChangeUnbond(e);
                }}
                disabled={disabled}
              />
            </div>
            <div>{maxBondedJsx}</div>
          </div>
        </section>
        <section>
          <ButtonSubmitInvert
            text={t('max')}
            disabled={disabled}
            onClick={() => {
              setLocalBond(unbondToMinUnit);
              updateParentState(unbondToMinUnit);
            }}
          />
        </section>
      </div>
      <div className="availableOuter">{maxBondedJsx}</div>
    </InputWrapper>
  );
};
