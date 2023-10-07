// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ButtonHelp,
  ButtonPrimaryInvert,
  ModalPadding,
} from '@polkadot-cloud/react';
import { planckToUnit, unitToPlanck } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import Slider from 'rc-slider';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useTransferOptions } from 'contexts/TransferOptions';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { Close } from 'library/Modal/Close';
import { Title } from 'library/Modal/Title';
import { SliderWrapper } from 'modals/ManagePool/Wrappers';
import 'rc-slider/assets/index.css';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';

export const UpdateReserve = () => {
  const { t } = useTranslation('modals');
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { openHelp } = useHelp();
  const { setModalStatus } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { accountHasSigner } = useImportedAccounts();
  const { feeReserve, setFeeReserveBalance, getTransferOptions } =
    useTransferOptions();

  const { edReserved } = getTransferOptions(activeAccount);
  const minReserve = planckToUnit(edReserved, units);
  const maxReserve = minReserve.plus(
    ['polkadot', 'westend'].includes(network) ? 3 : 1
  );

  const [sliderReserve, setSliderReserve] = useState<number>(
    planckToUnit(feeReserve, units).plus(minReserve).decimalPlaces(3).toNumber()
  );

  const sliderProps = {
    trackStyle: {
      backgroundColor: 'var(--accent-color-primary)',
    },
    handleStyle: {
      backgroundColor: 'var(--background-primary)',
      borderColor: 'var(--accent-color-primary)',
      opacity: 1,
    },
  };

  const handleChange = (val: BigNumber) => {
    // deduct ED from reserve amount.
    val = val.decimalPlaces(3);
    const actualReserve = BigNumber.max(val.minus(minReserve), 0).toNumber();
    const actualReservePlanck = unitToPlanck(actualReserve.toString(), units);
    setSliderReserve(val.decimalPlaces(3).toNumber());
    setFeeReserveBalance(actualReservePlanck);
  };

  return (
    <>
      <Close />
      <ModalPadding>
        <Title
          title={t('reserveBalance')}
          helpKey="Reserve Balance"
          style={{ padding: '0.5rem 0 0 0' }}
        />
        <SliderWrapper style={{ marginTop: '1rem' }}>
          <p>{t('reserveText', { unit })}</p>
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
              <h4>
                {t('reserveForExistentialDeposit')}
                <FontAwesomeIcon
                  icon={faLock}
                  transform="shrink-3"
                  style={{ marginLeft: '0.5rem' }}
                />
              </h4>
              <h2>
                {minReserve.isZero() ? (
                  <>
                    {t('none')}
                    <ButtonHelp
                      onClick={() =>
                        openHelp('Reserve Balance For Existential Deposit')
                      }
                      style={{ marginLeft: '0.65rem' }}
                    />
                  </>
                ) : (
                  `${minReserve.decimalPlaces(4).toString()} ${unit}`
                )}
              </h2>
            </CardHeaderWrapper>

            <CardHeaderWrapper>
              <h4>{t('reserveForTxFees')}</h4>
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
              onClick={() => setModalStatus('closing')}
              disabled={!accountHasSigner(activeAccount)}
            />
          </div>
        </SliderWrapper>
      </ModalPadding>
    </>
  );
};
