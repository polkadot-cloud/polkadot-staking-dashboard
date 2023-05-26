// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ActionItem, ButtonSubmitInvert } from '@polkadotcloud/core-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { AccountInput } from 'library/AccountInput';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { WarningsWrapper } from 'modals/Wrappers';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MaybeAccount } from 'types';
import { CommissionWrapper } from '../Wrappers';

export const Commission = ({ setSection, incrementCalculateHeight }: any) => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setStatus: setModalStatus } = useModal();
  const { activeAccount } = useConnect();
  const { getBondedPool, updateBondedPools } = useBondedPools();
  const { isOwner, selectedActivePool } = useActivePools();
  const { getSignerWarnings } = useSignerWarnings();

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

  // Store the current commission value.
  const [commission, setCommission] = useState<number>(initialCommission);

  // Max commission enabled.
  const [maxCommissionEnabled, setMaxCommissionEnabled] = useState<boolean>(
    !!maxCommissionSet
  );

  // Store the maximum commission value.
  const [maxCommission, setMaxCommission] =
    useState<number>(initialMaxCommission);

  // Store the commission payee.
  const [payee, setPayee] = useState<MaybeAccount>(initialPayee);

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

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
  const commissionChanged =
    (!commissionCurrentSet && commission !== initialCommission) ||
    (commissionCurrentSet && commission !== initialCommission);

  const maxCommissionChanged =
    (!maxCommissionSet && maxCommission === initialMaxCommission) ||
    maxCommission !== initialMaxCommission;

  // Global form change.
  const noChange = !commissionChanged && !maxCommissionChanged;

  // Monitor when input items are invalid.
  const commissionAboveMax = commission > maxCommission;

  const invalidCurrentCommission =
    commissionChanged &&
    ((commission === 0 && payee !== null) ||
      (commission !== 0 && payee === null) ||
      commissionAboveMax);

  const invalidMaxCommission =
    maxCommissionChanged && maxCommission > initialMaxCommission;

  // Check there are txs to submit
  const txsToSubmit =
    commissionChanged || (maxCommissionChanged && maxCommissionEnabled);

  useEffect(() => {
    setValid(
      isOwner() &&
        !invalidCurrentCommission &&
        !invalidMaxCommission &&
        !noChange &&
        txsToSubmit
    );
  }, [
    isOwner(),
    invalidCurrentCommission,
    invalidMaxCommission,
    bondedPool,
    noChange,
    txsToSubmit,
  ]);

  useEffect(() => {
    resetToDefault();
  }, [bondedPool]);

  // Trigger modal resize when max commission is enabled / disabled.
  useEffect(() => {
    incrementCalculateHeight();
  }, [maxCommissionEnabled]);

  // tx to submit.
  const getTx = () => {
    if (!valid || !api) {
      return null;
    }

    const txs = [];
    if (commissionChanged) {
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
    if (maxCommissionChanged && maxCommissionEnabled) {
      txs.push(
        api.tx.nominationPools.setCommissionMax(
          poolId,
          new BigNumber(maxCommission).multipliedBy(10000000).toString()
        )
      );
    }

    if (txs.length === 1) {
      return txs[0];
    }
    return api.tx.utility.batch(txs);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus(2);
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
              max: maxCommissionChanged
                ? `${maxCommission.toFixed(2)}%`
                : pool.commission?.max || null,
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
    if (!commissionChanged) {
      return {
        text: t('commissionRate'),
        label: 'neutral',
      };
    }
    if (commissionAboveMax) {
      return {
        text: t('cannotBeAboveMax'),
        label: 'danger',
      };
    }
    return {
      text: t('commissionUpdated'),
      label: 'neutral',
    };
  })();

  const maxCommissionFeedback = (() => {
    if (!maxCommissionChanged) {
      return {
        text: t('maxCommission'),
        label: 'neutral',
      };
    }
    if (invalidMaxCommission) {
      return {
        text: t('cannotBeAboveExisting'),
        label: 'danger',
      };
    }
    return {
      text: t('maximumCommissionUpdated'),
      label: 'neutral',
    };
  })();

  const sliderProps = {
    trackStyle: {
      backgroundColor: 'var(--network-color-primary)',
    },
    railStyle: {
      backgroundColor: 'var(--button-secondary-background)',
    },
    handleStyle: {
      backgroundColor: 'var(--background-primary)',
      borderColor: 'var(--network-color-primary)',
      opacity: 1,
    },
    activeDotStyle: {
      backgroundColor: 'var(--background-primary)',
    },
  };

  return (
    <>
      <div className="padding">
        {warnings.length > 0 ? (
          <WarningsWrapper>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </WarningsWrapper>
        ) : null}

        <ActionItem text={t('setCommission')} />

        <CommissionWrapper>
          <h5 className={commissionFeedback.label}>
            {commissionFeedback.text}
          </h5>
          <div>
            <h4 className="current">{commission}% </h4>
            <div className="slider">
              <Slider
                value={commission}
                step={0.25}
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
          </div>
        </CommissionWrapper>

        <AccountInput
          defaultLabel={t('inputPayeeAccount')}
          successLabel={`${t('payeeAdded')}`}
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
        />

        <ActionItem
          style={{
            marginTop: '2rem',
            borderBottomWidth: maxCommissionEnabled ? '1px' : 0,
          }}
          text={t('setMaxCommission')}
          toggled={maxCommissionEnabled}
          onToggle={(val) => setMaxCommissionEnabled(val)}
          disabled={!!maxCommissionSet}
        />

        {maxCommissionEnabled && (
          <CommissionWrapper>
            <h5 className={maxCommissionFeedback.label}>
              {maxCommissionFeedback.text}
            </h5>
            <div>
              <h4 className="current">{maxCommission}% </h4>
              <div className="slider">
                <Slider
                  value={maxCommission}
                  step={0.25}
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
            </div>
          </CommissionWrapper>
        )}
      </div>
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
