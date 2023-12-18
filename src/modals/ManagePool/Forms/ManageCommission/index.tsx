// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import {
  ActionItem,
  ButtonHelp,
  ButtonSubmitInvert,
  ModalPadding,
  ModalWarnings,
} from '@polkadot-cloud/react';
import BigNumber from 'bignumber.js';
import { intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useHelp } from 'contexts/Help';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { MinDelayInput } from 'library/Form/MinDelayInput';
import { Warning } from 'library/Form/Warning';
import { useBatchCall } from 'library/Hooks/useBatchCall';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import 'rc-slider/assets/index.css';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { StyledSlider } from 'library/StyledSlider';
import { SliderWrapper } from '../../Wrappers';
import type { ChangeRateInput } from '../types';
import { usePoolCommission } from './provider';
import { CommissionCurrent } from './CommissionCurrent';
import { MaxCommission } from './MaxCommission';

export const ManageCommission = ({
  setSection,
  incrementCalculateHeight,
}: any) => {
  const { t } = useTranslation('modals');
  const { openHelp } = useHelp();
  const { api, consts } = useApi();
  const { stats } = usePoolsConfig();
  const { newBatchCall } = useBatchCall();
  const { activeAccount } = useActiveAccounts();
  const { setModalStatus } = useOverlay().modal;
  const { getSignerWarnings } = useSignerWarnings();
  const { isOwner, selectedActivePool } = useActivePools();
  const { getBondedPool, updateBondedPools } = useBondedPools();
  const {
    setChangeRate,
    getInitial,
    getCurrent,
    getEnabled,
    setEnabled,
    hasValue,
    resetAll,
    isUpdated,
  } = usePoolCommission();

  const commission = getCurrent('commission');
  const payee = getCurrent('payee');
  const maxCommission = getCurrent('max_commission');
  const changeRate = getCurrent('change_rate');

  const { expectedBlockTime } = consts;
  const { globalMaxCommission } = stats;
  const poolId = selectedActivePool?.id || 0;
  const bondedPool = getBondedPool(poolId);

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

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

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

  const hasCurrentCommission = payee && commission !== 0;
  const commissionCurrent = () => {
    return hasCurrentCommission ? [`${commission.toFixed(2)}%`, payee] : null;
  };

  // Monitor when input items change.

  const commissionUpdated = commission !== getInitial('commission');

  const changeRateUpdated =
    (!hasValue('change_rate') &&
      JSON.stringify(changeRate) ===
        JSON.stringify(getInitial('change_rate'))) ||
    (hasValue('change_rate') &&
      JSON.stringify(changeRate) !==
        JSON.stringify(getInitial('change_rate'))) ||
    (!hasValue('change_rate') && getEnabled('change_Rate'));

  const maxIncreaseUpdated =
    changeRate.maxIncrease !== getInitial('change_rate').maxIncrease;
  const minDelayUpdated =
    changeRate.minDelay !== getInitial('change_rate').minDelay;

  // Global form change.
  const noChange =
    !commissionUpdated && !isUpdated('max_commission') && !changeRateUpdated;

  // Monitor when input items are invalid.
  const commissionAboveMax = commission > maxCommission;
  const commissionAboveGlobal = commission > globalMaxCommission;

  const commissionAboveMaxIncrease =
    hasValue('change_rate') &&
    commission - getInitial('commission') > changeRate.maxIncrease;

  const invalidCurrentCommission =
    commissionUpdated &&
    ((commission === 0 && payee !== null) ||
      (commission !== 0 && payee === null) ||
      commissionAboveMax ||
      commissionAboveMaxIncrease ||
      commission > globalMaxCommission);

  const invalidMaxCommission =
    isUpdated('max_commission') && maxCommission > getInitial('max_commission');
  const maxCommissionAboveGlobal = maxCommission > globalMaxCommission;

  // Change rate is invalid if updated is not more restrictive than current.
  const invalidMaxIncrease =
    changeRateUpdated &&
    changeRate.maxIncrease > getInitial('change_rate').maxIncrease;

  const invalidMinDelay =
    changeRateUpdated &&
    changeRate.minDelay < getInitial('change_rate').minDelay;

  const invalidChangeRate = invalidMaxIncrease || invalidMinDelay;

  // Check there are txs to submit.
  const txsToSubmit =
    commissionUpdated ||
    (isUpdated('max_commission') && getEnabled('max_commission')) ||
    (changeRateUpdated && getEnabled('change_rate'));

  useEffect(() => {
    setValid(
      isOwner() &&
        !invalidCurrentCommission &&
        !commissionAboveGlobal &&
        !invalidMaxCommission &&
        !maxCommissionAboveGlobal &&
        !invalidChangeRate &&
        !noChange &&
        txsToSubmit
    );
  }, [
    isOwner(),
    invalidCurrentCommission,
    invalidMaxCommission,
    commissionAboveGlobal,
    maxCommissionAboveGlobal,
    invalidChangeRate,
    bondedPool,
    noChange,
    txsToSubmit,
  ]);

  useEffect(() => {
    resetAll();
  }, [bondedPool]);

  // Trigger modal resize when commission options are enabled / disabled.
  // TODO: modal resize on window resize.
  useEffect(() => {
    incrementCalculateHeight();
  }, [getEnabled('max_commission'), getEnabled('change_rate')]);

  // tx to submit.
  const getTx = () => {
    if (!valid || !api) {
      return null;
    }

    const txs = [];
    if (commissionUpdated) {
      txs.push(
        api.tx.nominationPools.setCommission(
          poolId,
          hasCurrentCommission
            ? [
                new BigNumber(commission).multipliedBy(10000000).toString(),
                payee,
              ]
            : null
        )
      );
    }
    if (isUpdated('max_commission') && getEnabled('max_commission')) {
      txs.push(
        api.tx.nominationPools.setCommissionMax(
          poolId,
          new BigNumber(maxCommission).multipliedBy(10000000).toString()
        )
      );
    }
    if (changeRateUpdated && getEnabled('change_rate')) {
      txs.push(
        api.tx.nominationPools.setCommissionChangeRate(poolId, {
          maxIncrease: new BigNumber(changeRate.maxIncrease)
            .multipliedBy(10000000)
            .toString(),
          minDelay: changeRate.minDelay.toString(),
        })
      );
    }

    if (txs.length === 1) {
      return txs[0];
    }
    return newBatchCall(txs, activeAccount);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
    callbackInBlock: () => {
      const pool = getBondedPool(poolId);
      if (pool) {
        updateBondedPools([
          {
            ...pool,
            commission: {
              ...pool.commission,
              current: commissionCurrent(),
              max: isUpdated('max_commission')
                ? `${maxCommission.toFixed(2)}%`
                : pool.commission?.max || null,
              changeRate: changeRateUpdated
                ? {
                    maxIncrease: `${changeRate.maxIncrease.toFixed(2)}%`,
                    minDelay: String(changeRate.minDelay),
                  }
                : pool.commission?.changeRate || null,
            },
          },
        ]);
      }
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

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
    <>
      <ModalPadding horizontalOnly>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}

        <ActionItem
          text={t('commissionRate')}
          inlineButton={
            <ButtonHelp onClick={() => openHelp('Pool Commission Rate')} />
          }
        />

        {/* TODO: spread these commission meta values */}
        <CommissionCurrent
          commissionAboveMax={commissionAboveMax}
          commissionAboveGlobal={commissionAboveGlobal}
          commissionAboveMaxIncrease={commissionAboveMaxIncrease}
        />

        <ActionItem
          style={{
            marginTop: '2rem',
            borderBottomWidth: getEnabled('max_commission') ? '1px' : 0,
          }}
          text={t('maxCommission')}
          toggled={getEnabled('max_commission')}
          onToggle={(val) => setEnabled('max_commission', val)}
          disabled={!!hasValue('max_commission')}
          inlineButton={
            <ButtonHelp onClick={() => openHelp('Pool Max Commission')} />
          }
        />

        {/* TODO: spread these commission meta values */}
        <MaxCommission
          invalidMaxCommission={invalidMaxCommission}
          maxCommissionAboveGlobal={maxCommissionAboveGlobal}
        />

        <ActionItem
          style={{
            marginTop: '2rem',
            borderBottomWidth: getEnabled('change_rate') ? '1px' : 0,
          }}
          text={t('changeRate')}
          toggled={getEnabled('change_rate')}
          onToggle={(val) => setEnabled('change_rate', val)}
          disabled={!!hasValue('change_rate')}
          inlineButton={
            <ButtonHelp
              onClick={() => openHelp('Pool Commission Change Rate')}
            />
          }
        />

        {getEnabled('change_rate') && (
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
        )}
      </ModalPadding>
      <SubmitTx
        valid={valid}
        buttons={[
          <ButtonSubmitInvert
            key="button_back"
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-1"
            onClick={() => {
              setSection(0);
              resetAll();
            }}
          />,
        ]}
        {...submitExtrinsic}
      />
    </>
  );
};
