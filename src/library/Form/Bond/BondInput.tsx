// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonInvert } from '@rossbulat/polkadot-dashboard-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BondInputProps } from '../types';
import { InputWrapper } from '../Wrappers';

export const BondInput = ({
  setters = [],
  disabled,
  defaultValue,
  freeBalance,
  disableTxFeeUpdate = false,
  value = '0',
  syncing = false,
}: BondInputProps) => {
  const { t } = useTranslation('library');
  const { network } = useApi();
  const { activeAccount } = useConnect();

  // the current local bond value
  const [localBond, setLocalBond] = useState<string>(value);

  // reset value to default when changing account.
  useEffect(() => {
    setLocalBond(defaultValue ?? '0');
  }, [activeAccount]);

  useEffect(() => {
    if (!disableTxFeeUpdate) {
      setLocalBond(value.toString());
    }
  }, [value]);

  // handle change for bonding.
  const handleChangeBond = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (new BigNumber(val).isNaN() && val !== '') {
      return;
    }
    setLocalBond(val);
    updateParentState(val);
  };

  // apply bond to parent setters.
  const updateParentState = (val: string) => {
    for (const s of setters) {
      s.set({
        ...s.current,
        bond: val,
      });
    }
  };

  // available funds as jsx.
  const availableFundsJsx = (
    <p>
      {syncing
        ? '...'
        : `${freeBalance.toFormat()} ${network.unit} ${t('available')}`}
    </p>
  );

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
            <div>{availableFundsJsx}</div>
          </div>
        </section>
        <section>
          <ButtonInvert
            text={t('max')}
            disabled={
              disabled || syncing || freeBalance.isEqualTo(new BigNumber(0))
            }
            onClick={() => {
              setLocalBond(freeBalance.toString());
              updateParentState(freeBalance.toString());
            }}
          />
        </section>
      </div>
      <div className="availableOuter">{availableFundsJsx}</div>
    </InputWrapper>
  );
};
