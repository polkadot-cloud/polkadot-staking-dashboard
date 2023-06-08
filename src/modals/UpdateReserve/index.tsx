// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonPrimaryInvert, ModalPadding } from '@polkadotcloud/core-ui';
import { planckToUnit, unitToPlanck } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTransferOptions } from 'contexts/TransferOptions';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { Close } from 'library/Modal/Close';
import { WithSliderWrapper } from 'modals/ManagePool/Wrappers';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const UpdateReserve = () => {
  const { t } = useTranslation('modals');
  const {
    network: { units, unit },
  } = useApi();
  const { network } = useApi();
  const { setStatus } = useModal();
  const { reserve, setReserve, getTransferOptions } = useTransferOptions();
  const { activeAccount, accountHasSigner } = useConnect();
  const { forceReserved } = getTransferOptions(activeAccount);

  const minReserve = planckToUnit(forceReserved, units);
  const maxReserve = minReserve.plus(
    ['polkadot', 'westend'].includes(network.name) ? 3 : 1
  );

  const [sliderReserve, setSliderReserve] = useState<number>(
    planckToUnit(reserve, units).plus(minReserve).decimalPlaces(3).toNumber()
  );

  const sliderProps = {
    trackStyle: {
      backgroundColor: 'var(--network-color-primary)',
    },
    handleStyle: {
      backgroundColor: 'var(--background-primary)',
      borderColor: 'var(--network-color-primary)',
      opacity: 1,
    },
  };

  const handleChange = (val: BigNumber) => {
    // deduct ED from reserve amount.
    val = val.decimalPlaces(3);
    const actualReserve = BigNumber.max(val.minus(minReserve), 0).toNumber();
    const actualReservePlanck = unitToPlanck(actualReserve.toString(), units);

    setSliderReserve(val.decimalPlaces(3).toNumber());

    setReserve(actualReservePlanck);
    localStorage.setItem(
      `${network.name}_${activeAccount}_reserve`,
      actualReservePlanck.toString()
    );
  };

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded" style={{ padding: '0 0.5rem' }}>
          Reserve Balance
        </h2>

        <WithSliderWrapper>
          <p>
            Control how much {unit} is reserved to pay for transaction fees.
            This amount is added on top of any funds needed to cover the
            existential deposit to your account.
          </p>
          <div>
            <div className="slider no-value">
              <Slider
                min={0}
                max={maxReserve.toNumber()}
                value={sliderReserve}
                step={0.01}
                onChange={(val) => {
                  if (typeof val === 'number' && val >= minReserve.toNumber()) {
                    handleChange(new BigNumber(val));
                  }
                }}
                {...sliderProps}
              />
            </div>
          </div>

          <div className="stats">
            <CardHeaderWrapper>
              <h4>Reserve for Existential Deposit</h4>
              <h2>
                {minReserve.decimalPlaces(4).toString()} {unit}
              </h2>
            </CardHeaderWrapper>

            <CardHeaderWrapper>
              <h4>Reserve for Tx Fees</h4>
              <h2>
                {BigNumber.max(
                  new BigNumber(sliderReserve)
                    .minus(minReserve)
                    .decimalPlaces(4)
                    .toString(),
                  0
                ).toString()}
                &nbsp;
                {unit}
              </h2>
            </CardHeaderWrapper>
          </div>

          <div className="done">
            <ButtonPrimaryInvert
              text={t('done')}
              onClick={() => {
                setStatus(0);
              }}
              disabled={!accountHasSigner(activeAccount)}
            />
          </div>
        </WithSliderWrapper>
      </ModalPadding>
    </>
  );
};
