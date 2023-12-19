// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { SliderWrapper } from 'modals/ManagePool/Wrappers';
import { StyledSlider } from 'library/StyledSlider';
import { usePoolCommission } from './provider';

export const MaxCommission = ({
  invalidMaxCommission,
  maxCommissionAboveGlobal,
}: {
  invalidMaxCommission: boolean;
  maxCommissionAboveGlobal: boolean;
}) => {
  const { t } = useTranslation('modals');
  const { getEnabled, getCurrent, setCommission, setMaxCommission, isUpdated } =
    usePoolCommission();

  // Get the current commission and max commission values.
  const commission = getCurrent('commission');
  const maxCommission = getCurrent('max_commission');
  const maxCommissionUpdated = isUpdated('max_commission');

  // Determine the max commission feedback to display.
  const maxCommissionFeedback = (() => {
    if (!maxCommissionUpdated) {
      return undefined;
    }
    if (invalidMaxCommission) {
      return {
        text: t('aboveExisting'),
        label: 'danger',
      };
    }
    if (maxCommissionAboveGlobal) {
      return {
        text: t('aboveGlobalMax'),
        label: 'danger',
      };
    }
    return {
      text: t('updated'),
      label: 'neutral',
    };
  })();

  return (
    getEnabled('max_commission') && (
      <SliderWrapper>
        <div>
          <h2>{maxCommission}% </h2>
          <h5 className={maxCommissionFeedback?.label || 'neutral'}>
            {!!maxCommissionFeedback && maxCommissionFeedback.text}
          </h5>
        </div>

        <StyledSlider
          value={maxCommission}
          step={0.1}
          onChange={(val) => {
            if (typeof val === 'number') {
              setMaxCommission(val);
              if (val < commission) {
                setCommission(val);
              }
            }
          }}
        />
      </SliderWrapper>
    )
  );
};
