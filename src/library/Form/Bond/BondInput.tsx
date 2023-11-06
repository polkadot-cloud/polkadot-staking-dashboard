// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmitInvert } from '@polkadot-cloud/react';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { InputWrapper } from '../Wrappers';
import type { BondInputProps } from '../types';

export const BondInput = ({
  setters = [],
  disabled,
  defaultValue,
  freeToBond,
  disableTxFeeUpdate = false,
  value = '0',
  syncing = false,
}: BondInputProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { unit },
  } = useNetwork();
  const { activeAccount } = useActiveAccounts();

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
      {syncing ? '...' : `${freeToBond.toFormat()} ${unit} ${t('available')}`}
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
                placeholder={`0 ${unit}`}
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
          <ButtonSubmitInvert
            text={t('max')}
            disabled={disabled || syncing || freeToBond.isZero()}
            onClick={() => {
              setLocalBond(freeToBond.toString());
              updateParentState(freeToBond.toString());
            }}
          />
        </section>
      </div>
      <div className="availableOuter">{availableFundsJsx}</div>
    </InputWrapper>
  );
};
