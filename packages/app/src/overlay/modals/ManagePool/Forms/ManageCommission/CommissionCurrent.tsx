// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountInput } from 'library/AccountInput';
import { StyledSlider } from 'library/StyledSlider';
import { SliderWrapper } from 'modals/ManagePool/Wrappers';
import { useTranslation } from 'react-i18next';
import { usePoolCommission } from './provider';

export const CommissionCurrent = ({
  commissionAboveMax,
  commissionAboveGlobal,
  commissionAboveMaxIncrease,
}: {
  commissionAboveMax: boolean;
  commissionAboveGlobal: boolean;
  commissionAboveMaxIncrease: boolean;
}) => {
  const { t } = useTranslation('modals');
  const {
    getEnabled,
    getInitial,
    getCurrent,
    setPayee,
    setCommission,
    setMaxCommission,
    isUpdated,
  } = usePoolCommission();

  // Get the current commission, payee and max commission values.
  const commission = getCurrent('commission');
  const payee = getCurrent('payee');
  const maxCommission = getCurrent('max_commission');

  // Determine the commission feedback to display.
  const commissionFeedback = (() => {
    if (!isUpdated('commission')) {
      return undefined;
    }
    if (commissionAboveMaxIncrease) {
      return {
        text: t('beyondMaxIncrease'),
        label: 'danger',
      };
    }
    if (commissionAboveGlobal) {
      return {
        text: t('aboveGlobalMax'),
        label: 'danger',
      };
    }
    if (commissionAboveMax) {
      return {
        text: t('aboveMax'),
        label: 'danger',
      };
    }
    return {
      text: t('updated'),
      label: 'neutral',
    };
  })();

  return (
    <>
      <SliderWrapper>
        <div>
          <h2>{commission}% </h2>
          <h5 className={commissionFeedback?.label || 'neutral'}>
            {!!commissionFeedback && commissionFeedback.text}
          </h5>
        </div>

        <StyledSlider
          value={commission}
          step={0.1}
          onChange={(val) => {
            if (typeof val === 'number') {
              setCommission(val);
              if (val > maxCommission && getEnabled('max_commission')) {
                setMaxCommission(Math.min(getInitial('max_commission'), val));
              }
            }
          }}
        />
      </SliderWrapper>

      <AccountInput
        defaultLabel={t('inputPayeeAccount')}
        successLabel={t('payeeAdded')}
        locked={payee !== null}
        successCallback={async (input) => {
          setPayee(input);
        }}
        resetCallback={() => {
          setPayee(null);
        }}
        disallowAlreadyImported={false}
        initialValue={payee}
        inactive={commission === 0}
        border={payee === null}
      />
    </>
  );
};
