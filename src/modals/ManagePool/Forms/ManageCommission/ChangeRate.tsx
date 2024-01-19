// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MinDelayInput } from 'library/Form/MinDelayInput';
import { StyledSlider } from 'library/StyledSlider';
import { SliderWrapper } from 'modals/ManagePool/Wrappers';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { intervalToDuration } from 'date-fns';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { usePoolCommission } from './provider';
import type { ChangeRateInput } from '../types';

export const ChangeRate = ({
  invalidMaxIncrease,
  invalidMinDelay,
}: {
  invalidMaxIncrease: boolean;
  invalidMinDelay: boolean;
}) => {
  const { t } = useTranslation('modals');
  const { consts } = useApi();
  const { getEnabled, getInitial, getCurrent, setChangeRate } =
    usePoolCommission();

  const { expectedBlockTime } = consts;

  // Get the current change rate value.
  const changeRate = getCurrent('change_rate');

  // Convert a block number into an estimated change rate duration.
  const minDelayToInput = (delay: number) => {
    const milliseconds = expectedBlockTime.multipliedBy(delay);
    const end = milliseconds.isZero()
      ? 0
      : milliseconds.integerValue().toNumber();

    const { years, months, days, hours, minutes } = intervalToDuration({
      start: 0,
      end,
    });

    return {
      years: years || 0,
      months: months || 0,
      days: days || 0,
      hours: hours || 0,
      minutes: minutes || 0,
    };
  };

  // Convert the estimated change duration into a block number
  const inputToMinDelay = (input: ChangeRateInput) => {
    const { years, months, days, hours, minutes } = input;

    // calculate number of seconds from changeRateInput
    const yearsSeconds = new BigNumber(years).multipliedBy(31536000);
    const monthsSeconds = new BigNumber(months).multipliedBy(2628288);
    const daysSeconds = new BigNumber(days).multipliedBy(86400);
    const hoursSeconds = new BigNumber(hours).multipliedBy(3600);
    const minutesSeconds = new BigNumber(minutes).multipliedBy(60);

    return yearsSeconds
      .plus(monthsSeconds)
      .plus(daysSeconds)
      .plus(hoursSeconds)
      .plus(minutesSeconds)
      .dividedBy(expectedBlockTime.dividedBy(1000))
      .integerValue()
      .toNumber();
  };

  // Store the change rate value in input format.
  const [changeRateInput, setChangeRateInput] = useState<ChangeRateInput>(
    minDelayToInput(changeRate.minDelay)
  );

  // Handle an update to the change rate input.
  const handleChangeRateInput = (field: string, value: number) => {
    const newChangeRateInput = {
      ...changeRateInput,
      [field]: value,
    };
    setChangeRateInput(newChangeRateInput);
    setChangeRate({
      ...changeRate,
      minDelay: inputToMinDelay(newChangeRateInput),
    });
  };

  // Determine whether the change rate values have been updated.
  const maxIncreaseUpdated =
    changeRate.maxIncrease !== getInitial('change_rate').maxIncrease;

  const minDelayUpdated =
    changeRate.minDelay !== getInitial('change_rate').minDelay;

  // Determine the max increase feedback to display.
  const maxIncreaseFeedback = (() => {
    if (!maxIncreaseUpdated) {
      return undefined;
    }
    if (invalidMaxIncrease) {
      return {
        text: t('aboveExisting'),
        label: 'danger',
      };
    }
    return {
      text: t('updated'),
      label: 'neutral',
    };
  })();

  // Determine the min delay feedback to display.
  const minDelayFeedback = (() => {
    if (!minDelayUpdated) {
      return undefined;
    }
    if (invalidMinDelay) {
      return {
        text: t('belowExisting'),
        label: 'danger',
      };
    }
    return {
      text: t('updated'),
      label: 'neutral',
    };
  })();

  return (
    getEnabled('change_rate') && (
      <SliderWrapper>
        <div>
          <h2>{changeRate.maxIncrease}% </h2>
          <h5 className={maxIncreaseFeedback?.label || 'neutral'}>
            {!!maxIncreaseFeedback && maxIncreaseFeedback.text}
          </h5>
        </div>

        <StyledSlider
          value={changeRate.maxIncrease}
          step={0.1}
          onChange={(val) => {
            if (typeof val === 'number') {
              setChangeRate({
                ...changeRate,
                maxIncrease: val,
              });
            }
          }}
        />

        <h5 style={{ marginTop: '1rem' }}>
          {t('minDelayBetweenUpdates')}
          {minDelayFeedback && (
            <span className={minDelayFeedback?.label || 'neutral'}>
              {minDelayFeedback.text}
            </span>
          )}
        </h5>
        <div className="changeRate">
          <MinDelayInput
            initial={changeRateInput.years}
            field="years"
            label={t('years')}
            handleChange={handleChangeRateInput}
          />
          <MinDelayInput
            initial={changeRateInput.months}
            field="months"
            label={t('months')}
            handleChange={handleChangeRateInput}
          />
          <MinDelayInput
            initial={changeRateInput.days}
            field="days"
            label={t('days')}
            handleChange={handleChangeRateInput}
          />
          <MinDelayInput
            initial={changeRateInput.hours}
            field="hours"
            label={t('hours')}
            handleChange={handleChangeRateInput}
          />
          <MinDelayInput
            initial={changeRateInput.minutes}
            field="minutes"
            label={t('minutes')}
            handleChange={handleChangeRateInput}
          />
        </div>
        <p>
          {t('thisMinimumDelay', {
            count: changeRate.minDelay,
          })}
        </p>
      </SliderWrapper>
    )
  );
};
