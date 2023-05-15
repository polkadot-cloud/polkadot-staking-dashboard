// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonSecondary } from '@polkadotcloud/core-ui';
import { planckToUnit } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { PaddingWrapper, WarningsWrapper } from 'modals/Wrappers';
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
  const { network } = useApi();

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
    setReserve(new BigNumber(e.currentTarget.value, units));
  };

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(<Warning text={t('readOnlyCannotSign')} />);
  }

  if (fundsFree.isLessThan(new BigNumber(0.1))) {
    warnings.push(<Warning text="Balance must be more than 0.1" />);
  }

  return (
    <>
      <PaddingWrapper>
        <h2 className="title unbounded">Update Reserve</h2>
        {warnings.length ? (
          <WarningsWrapper>
            {warnings.map((warning, index) => (
              <React.Fragment key={`warning_${index}`}>
                {warning}
              </React.Fragment>
            ))}
          </WarningsWrapper>
        ) : null}
        <SliderWrapper>
          <input
            className="slider"
            type="range"
            step="0.1"
            min="0"
            max={fundsFree.toString()}
            value={reserve.toString()}
            onChange={updateReserve}
            // disabled={warnings.length > 0}
          />
          <p>Reserve: {reserve.toString()}</p>
        </SliderWrapper>
        <ButtonSecondary
          onClick={() =>
            localStorage.setItem(
              `${network.name}_${activeAccount}_reserve`,
              reserve.toString()
            )
          }
          text="Confirm"
          disabled={warnings.length > 0}
        />
      </PaddingWrapper>
    </>
  );
};
