// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonPrimaryInvert, ModalPadding } from '@polkadotcloud/core-ui';
import { planckToUnit, unitToPlanck } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Close } from 'library/Modal/Close';
import { WithSliderWrapper } from 'modals/ManagePool/Wrappers';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const UpdateReserve = () => {
  const { t } = useTranslation('modals');
  const {
    network: { units },
    consts,
  } = useApi();
  const { reserve, setReserve } = useTransferOptions();
  const { activeAccount, accountHasSigner } = useConnect();
  const { network } = useApi();
  const { setStatus, setResize } = useModal();
  const { existentialDeposit } = consts;

  const minReserve = planckToUnit(existentialDeposit, units);
  const maxReserve = minReserve.plus(
    ['polkadot', 'westend'].includes(network.name) ? 3 : 1
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

  useEffect(() => {
    setResize();
  }, [reserve]);

  // test
  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded" style={{ margin: '0.5rem 0 2rem 0' }}>
          {t('updateReserve')}
        </h2>

        <WithSliderWrapper>
          <div>
            <h4 className="current">
              {planckToUnit(reserve, units).toString()}&nbsp;
              {network.unit}
            </h4>
            <div className="slider">
              <Slider
                min={minReserve.toNumber()}
                max={maxReserve.toNumber()}
                value={planckToUnit(reserve, units).toNumber()}
                step={0.01}
                onChange={(val) => {
                  if (typeof val === 'number') {
                    setReserve(
                      new BigNumber(unitToPlanck(val.toString(), units))
                    );
                  }
                }}
                {...sliderProps}
              />
            </div>
          </div>
          <p>{t('reserveText')}</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <ButtonPrimaryInvert
              text={t('done')}
              onClick={() => {
                setStatus(0);
                localStorage.setItem(
                  `${network.name}_${activeAccount}_reserve`,
                  planckToUnit(reserve, units).toString()
                );
              }}
              disabled={!accountHasSigner(activeAccount)}
            />
          </div>
        </WithSliderWrapper>
      </ModalPadding>
    </>
  );
};
