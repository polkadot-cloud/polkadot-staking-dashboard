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
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useHelp } from 'contexts/Help';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { Warning } from 'library/Form/Warning';
import { useBatchCall } from 'library/Hooks/useBatchCall';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import 'rc-slider/assets/index.css';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { usePoolCommission } from './provider';
import { CommissionCurrent } from './CommissionCurrent';
import { MaxCommission } from './MaxCommission';
import { ChangeRate } from './ChangeRate';

export const ManageCommission = ({
  setSection,
  incrementCalculateHeight,
}: {
  setSection: Dispatch<SetStateAction<number>>;
  incrementCalculateHeight: () => void;
}) => {
  const { t } = useTranslation('modals');
  const { openHelp } = useHelp();
  const {
    api,
    poolsConfig: { globalMaxCommission },
  } = useApi();
  const { newBatchCall } = useBatchCall();
  const { activeAccount } = useActiveAccounts();
  const { setModalStatus } = useOverlay().modal;
  const { getSignerWarnings } = useSignerWarnings();
  const { isOwner, selectedActivePool } = useActivePools();
  const { getBondedPool, updateBondedPools } = useBondedPools();
  const {
    getInitial,
    getCurrent,
    getEnabled,
    setEnabled,
    hasValue,
    resetAll,
    isUpdated,
  } = usePoolCommission();

  const poolId = selectedActivePool?.id || 0;
  const bondedPool = getBondedPool(poolId);

  // Get currently set commission values.
  const commission = getCurrent('commission');
  const payee = getCurrent('payee');
  const maxCommission = getCurrent('max_commission');
  const changeRate = getCurrent('change_rate');

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // Monitor when input items change.
  const commissionUpdated: boolean = commission !== getInitial('commission');

  // Global form change.
  const noChange: boolean =
    !commissionUpdated &&
    !isUpdated('max_commission') &&
    !isUpdated('change_rate');

  // Monitor when input items are invalid.
  const commissionAboveMax: boolean =
    hasValue('max_commission') && commission > maxCommission;
  const commissionAboveGlobal = commission > globalMaxCommission;

  const commissionAboveMaxIncrease: boolean =
    hasValue('change_rate') &&
    commission - getInitial('commission') > changeRate.maxIncrease;

  const invalidCurrentCommission: boolean =
    commissionUpdated &&
    ((commission === 0 && payee !== null) ||
      (commission !== 0 && payee === null) ||
      commissionAboveMax ||
      commissionAboveMaxIncrease ||
      commission > globalMaxCommission);

  const invalidMaxCommission: boolean =
    hasValue('max_commission') &&
    isUpdated('max_commission') &&
    maxCommission > getInitial('max_commission');

  const maxCommissionAboveGlobal: boolean =
    getEnabled('max_commission') && maxCommission > globalMaxCommission;

  // Change rate is invalid if updated is not more restrictive than current.
  const invalidMaxIncrease: boolean =
    getEnabled('change_rate') &&
    isUpdated('change_rate') &&
    changeRate.maxIncrease > getInitial('change_rate').maxIncrease;

  const invalidMinDelay: boolean =
    getEnabled('change_rate') &&
    isUpdated('change_rate') &&
    changeRate.minDelay < getInitial('change_rate').minDelay;

  const invalidChangeRate: boolean = invalidMaxIncrease || invalidMinDelay;

  const currentCommissionSet: boolean = payee && commission !== 0;

  // Check there are txs to submit.
  const txsToSubmit =
    commissionUpdated ||
    (isUpdated('max_commission') && getEnabled('max_commission')) ||
    (isUpdated('change_rate') && getEnabled('change_rate'));

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
          currentCommissionSet
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
    if (isUpdated('change_rate') && getEnabled('change_rate')) {
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
              current: currentCommissionSet
                ? [`${commission.toFixed(2)}%`, payee]
                : null,
              max: isUpdated('max_commission')
                ? `${maxCommission.toFixed(2)}%`
                : pool.commission?.max || null,
              changeRate: isUpdated('change_rate')
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

  // Commission current meta required for form.
  const commissionCurrentMeta = {
    commissionAboveMax,
    commissionAboveGlobal,
    commissionAboveMaxIncrease,
  };

  // Max commission meta required for form.
  const maxCommissionMeta = {
    invalidMaxCommission,
    maxCommissionAboveGlobal,
  };

  // Change rate meta required for form.
  const changeRateMeta = {
    invalidMaxIncrease,
    invalidMinDelay,
  };

  // Get transaction signer warnings.
  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  // Update whether commission configs are valid on each invalid input, and when tx object changes.
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

  // Trigger modal resize when commission options are enabled / disabled.
  useEffect(() => {
    incrementCalculateHeight();
  }, [getEnabled('max_commission'), getEnabled('change_rate')]);

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
        <CommissionCurrent {...commissionCurrentMeta} />

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
        <MaxCommission {...maxCommissionMeta} />

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
        <ChangeRate {...changeRateMeta} />
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
