// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit, unitToPlanck } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from 'modals/Wrappers';
import type { ChangeEvent } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SliderWrapper } from './Wrapper';

export const UpdateReserve = () => {
  const { t } = useTranslation('modals');
  const { units } = useApi().network;
  const { activeAccount, accountHasSigner } = useConnect();
  const { setReserve, reserve, getTransferOptions } = useTransferOptions();
  const { getLocks, getBalance } = useBalances();
  const allTransferOptions = getTransferOptions(activeAccount);
  const balance = getBalance(activeAccount);
  const { miscFrozen } = balance;

  // check account non-staking locks
  const locks = getLocks(activeAccount);
  const locksStaking = locks.find(({ id }) => id === 'staking');
  const lockStakingAmount = locksStaking
    ? locksStaking.amount
    : new BigNumber(0);
  const fundsFree = planckToUnit(
    allTransferOptions.freeBalance.minus(miscFrozen.minus(lockStakingAmount)),
    units
  );

  const updateReserve = (e: ChangeEvent<HTMLInputElement>) => {
    setReserve(new BigNumber(unitToPlanck(e.currentTarget.value, units)));
  };

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(<Warning text={t('readOnlyCannotSign')} />);
  }
  if (fundsFree.isLessThan(new BigNumber(1))) {
    warnings.push(<Warning text="Balance must be more than 1" />);
  }

  const reserveValue = planckToUnit(reserve, units).toString();
  return (
    <>
      <PaddingWrapper>
        <Title title="Update Reserve" />
        {warnings.length ? (
          <div>
            {warnings.map((warning, index) => (
              <React.Fragment key={`warning_${index}`}>
                {warning}
              </React.Fragment>
            ))}
          </div>
        ) : null}
        <SliderWrapper>
          <input
            className="slider"
            type="range"
            min="0"
            max={fundsFree.decimalPlaces(0).toString()}
            value={reserveValue}
            onChange={updateReserve}
            disabled={!accountHasSigner(activeAccount)}
          />
          <p>Reserve: {reserve.toString()}</p>
        </SliderWrapper>
      </PaddingWrapper>
    </>
  );
};
