// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
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
  const { activeAccount, accountHasSigner } = useConnect();
  const { setReserve, reserve } = useTransferOptions();

  const updateReserve = (e: ChangeEvent<HTMLInputElement>) => {
    setReserve(new BigNumber(e.currentTarget.value));
  };

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(<Warning text={t('readOnlyCannotSign')} />);
  }

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
            max="3000000000"
            value={reserve.toString()}
            onChange={updateReserve}
          />
          <p>Reserve: {reserve.toString()}</p>
        </SliderWrapper>
      </PaddingWrapper>
    </>
  );
};
