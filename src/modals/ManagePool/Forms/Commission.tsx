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
import { rmCommas } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { intervalToDuration } from 'date-fns';
import Slider from 'rc-slider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useHelp } from 'contexts/Help';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { AccountInput } from 'library/AccountInput';
import { MinDelayInput } from 'library/Form/MinDelayInput';
import { Warning } from 'library/Form/Warning';
import { useBatchCall } from 'library/Hooks/useBatchCall';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import 'rc-slider/assets/index.css';
import type { MaybeAddress } from 'types';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { SliderWrapper } from '../Wrappers';
import type { ChangeRateInput } from './types';

export const Commission = ({ setSection, incrementCalculateHeight }: any) => {
  const { t } = useTranslation('modals');
  const { openHelp } = useHelp();
  const { api, consts } = useApi();
  const { activeAccount } = useActiveAccounts();
  const { newBatchCall } = useBatchCall();
  const { stats } = usePoolsConfig();
  const { setModalStatus } = useOverlay().modal;
  const { getSignerWarnings } = useSignerWarnings();
  const { isOwner, selectedActivePool } = useActivePools();
  const { getBondedPool, updateBondedPools } = useBondedPools();
  const { expectedBlockTime } = consts;
  const { globalMaxCommission } = stats;

  const poolId = selectedActivePool?.id || 0;
  const bondedPool = getBondedPool(poolId);

  const commissionCurrentSet = !!bondedPool?.commission?.current;
  const initialCommission = Number(
    (bondedPool?.commission?.current?.[0] || '0%').slice(0, -1)
  );
  const initialPayee = bondedPool?.commission?.current?.[1] || null;

  const maxCommissionSet = !!bondedPool?.commission?.max;
  const initialMaxCommission = Number(
    (bondedPool?.commission?.max || '100%').slice(0, -1)
  );

  const changeRateSet = !!bondedPool?.commission?.changeRate;
  const initialChangeRate = (() => {
    const raw = bondedPool?.commission?.changeRate;
    return raw
      ? {
          maxIncrease: Number(raw.maxIncrease.slice(0, -1)),
          minDelay: Number(rmCommas(raw.minDelay)),
        }
      : {
          maxIncrease: 100,
          minDelay: 0,
        };
  })();

  // Store the current commission value.
  const [commission, setCommission] = useState<number>(initialCommission);

  // Max commission enabled.
  const [maxCommissionEnabled, setMaxCommissionEnabled] =
    useState<boolean>(!!maxCommissionSet);

  // Change rate enabled.
  const [changeRateEnabled, setChangeRateEnabled] =
    useState<boolean>(!!changeRateSet);

  // Store the commission payee.
  const [payee, setPayee] = useState<MaybeAddress>(initialPayee);

  // Store the maximum commission value.
  const [maxCommission, setMaxCommission] =
    useState<number>(initialMaxCommission);

  // Store the change rate value.
  const [changeRate, setChangeRate] = useState<{
    maxIncrease: number;
    minDelay: number;
  }>(initialChangeRate);

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

  const resetToDefault = () => {
    setCommission(initialCommission);
    setPayee(initialPayee);
    setMaxCommission(initialMaxCommission);
  };

  const hasCurrentCommission = payee && commission !== 0;
  const commissionCurrent = () => {
    return hasCurrentCommission ? [`${commission.toFixed(2)}%`, payee] : null;
  };

  // Monitor when input items change.
  const commissionUpdated =
    (!commissionCurrentSet && commission !== initialCommission) ||
    (commissionCurrentSet && commission !== initialCommission);

  const maxCommissionUpdated =
    (!maxCommissionSet && maxCommission === initialMaxCommission) ||
    maxCommission !== initialMaxCommission ||
    (!maxCommissionSet && maxCommissionEnabled);

  const changeRateUpdated =
    (!changeRateSet &&
      JSON.stringify(changeRate) === JSON.stringify(initialChangeRate)) ||
    (changeRateSet &&
      JSON.stringify(changeRate) !== JSON.stringify(initialChangeRate)) ||
    (!changeRateSet && changeRateEnabled);

  const maxIncreaseUpdated =
    changeRate.maxIncrease !== initialChangeRate.maxIncrease;
  const minDelayUpdated = changeRate.minDelay !== initialChangeRate.minDelay;

  // Global form change.
  const noChange =
    !commissionUpdated && !maxCommissionUpdated && !changeRateUpdated;

  // Monitor when input items are invalid.
  const commissionAboveMax = commission > maxCommission;
  const commissionAboveGlobal = commission > globalMaxCommission;

  const commissionAboveMaxIncrease =
    changeRateSet && commission - initialCommission > changeRate.maxIncrease;

  const invalidCurrentCommission =
    commissionUpdated &&
    ((commission === 0 && payee !== null) ||
      (commission !== 0 && payee === null) ||
      commissionAboveMax ||
      commissionAboveMaxIncrease ||
      commission > globalMaxCommission);

  const invalidMaxCommission =
    maxCommissionUpdated && maxCommission > initialMaxCommission;
  const maxCommissionAboveGlobal = maxCommission > globalMaxCommission;

  // Change rate is invalid if updated is not more restrictive than current.
  const invalidMaxIncrease =
    changeRateUpdated && changeRate.maxIncrease > initialChangeRate.maxIncrease;

  const invalidMinDelay =
    changeRateUpdated && changeRate.minDelay < initialChangeRate.minDelay;

  const invalidChangeRate = invalidMaxIncrease || invalidMinDelay;

  // Check there are txs to submit.
  const txsToSubmit =
    commissionUpdated ||
    (maxCommissionUpdated && maxCommissionEnabled) ||
    (changeRateUpdated && changeRateEnabled);

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
    resetToDefault();
  }, [bondedPool]);

  // Trigger modal resize when commission options are enabled / disabled.
  useEffect(() => {
    incrementCalculateHeight();
  }, [maxCommissionEnabled, changeRateEnabled]);

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
    if (maxCommissionUpdated && maxCommissionEnabled) {
      txs.push(
        api.tx.nominationPools.setCommissionMax(
          poolId,
          new BigNumber(maxCommission).multipliedBy(10000000).toString()
        )
      );
    }
    if (changeRateUpdated && changeRateEnabled) {
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
              max: maxCommissionUpdated
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

  const commissionFeedback = (() => {
    if (!commissionUpdated) {
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

  const sliderProps = {
    trackStyle: {
      backgroundColor: 'var(--accent-color-primary)',
    },
    railStyle: {
      backgroundColor: 'var(--button-secondary-background)',
    },
    handleStyle: {
      backgroundColor: 'var(--background-primary)',
      borderColor: 'var(--accent-color-primary)',
      opacity: 1,
    },
    activeDotStyle: {
      backgroundColor: 'var(--background-primary)',
    },
  };

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

        <SliderWrapper>
          <div>
            <h2>{commission}% </h2>
            <h5 className={commissionFeedback?.label || 'neutral'}>
              {!!commissionFeedback && commissionFeedback.text}
            </h5>
          </div>

          <div className="slider">
            <Slider
              value={commission}
              step={0.1}
              onChange={(val) => {
                if (typeof val === 'number') {
                  setCommission(val);
                  if (val > maxCommission && maxCommissionEnabled) {
                    setMaxCommission(Math.min(initialMaxCommission, val));
                  }
                }
              }}
              {...sliderProps}
            />
          </div>
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

        <ActionItem
          style={{
            marginTop: '2rem',
            borderBottomWidth: maxCommissionEnabled ? '1px' : 0,
          }}
          text={t('maxCommission')}
          toggled={maxCommissionEnabled}
          onToggle={(val) => setMaxCommissionEnabled(val)}
          disabled={!!maxCommissionSet}
          inlineButton={
            <ButtonHelp onClick={() => openHelp('Pool Max Commission')} />
          }
        />

        {maxCommissionEnabled && (
          <SliderWrapper>
            <div>
              <h2>{maxCommission}% </h2>
              <h5 className={maxCommissionFeedback?.label || 'neutral'}>
                {!!maxCommissionFeedback && maxCommissionFeedback.text}
              </h5>
            </div>

            <div className="slider">
              <Slider
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
                {...sliderProps}
              />
            </div>
          </SliderWrapper>
        )}

        <ActionItem
          style={{
            marginTop: '2rem',
            borderBottomWidth: changeRateEnabled ? '1px' : 0,
          }}
          text={t('changeRate')}
          toggled={changeRateEnabled}
          onToggle={(val) => setChangeRateEnabled(val)}
          disabled={!!changeRateSet}
          inlineButton={
            <ButtonHelp
              onClick={() => openHelp('Pool Commission Change Rate')}
            />
          }
        />

        {changeRateEnabled && (
          <SliderWrapper>
            <div>
              <h2>{changeRate.maxIncrease}% </h2>
              <h5 className={maxIncreaseFeedback?.label || 'neutral'}>
                {!!maxIncreaseFeedback && maxIncreaseFeedback.text}
              </h5>
            </div>

            <div className="slider">
              <Slider
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
                {...sliderProps}
              />
            </div>

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
              resetToDefault();
            }}
          />,
        ]}
        {...submitExtrinsic}
      />
    </>
  );
};
