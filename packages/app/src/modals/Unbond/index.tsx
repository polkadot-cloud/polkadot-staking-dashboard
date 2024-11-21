// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { getUnixTime } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxMeta } from 'contexts/TxMeta';
import { UnbondFeedback } from 'library/Form/Unbond/UnbondFeedback';
import { Warning } from 'library/Form/Warning';
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { timeleftAsString, planckToUnitBn } from 'library/Utils';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ModalNotes } from 'kits/Overlay/structure/ModalNotes';
import { ApiController } from 'controllers/Api';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';

export const Unbond = () => {
  const { t } = useTranslation('modals');
  const { txFees } = useTxMeta();
  const { activeAccount } = useActiveAccounts();
  const { notEnoughFunds } = useTxMeta();
  const { getBondedAccount } = useBonded();
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { erasToSeconds } = useErasToTimeLeft();
  const { getSignerWarnings } = useSignerWarnings();
  const { getTransferOptions } = useTransferOptions();
  const { isDepositor, pendingPoolRewards } = useActivePool();
  const { minNominatorBond: minNominatorBondBn } = useApi().stakingMetrics;
  const {
    setModalStatus,
    setModalResize,
    config: { options },
  } = useOverlay().modal;
  const {
    consts,
    poolsConfig: { minJoinBond: minJoinBondBn, minCreateBond: minCreateBondBn },
  } = useApi();

  const { bondFor } = options;
  const controller = getBondedAccount(activeAccount);
  const { bondDuration } = consts;

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

  const pendingRewardsUnit = planckToUnitBn(pendingPoolRewards, units);

  const isStaking = bondFor === 'nominator';
  const isPooling = bondFor === 'pool';

  const allTransferOptions = getTransferOptions(activeAccount);
  const { active: activeBn } = isPooling
    ? allTransferOptions.pool
    : allTransferOptions.nominate;

  // convert BigNumber values to number
  const freeToUnbond = planckToUnitBn(activeBn, units);
  const minJoinBond = planckToUnitBn(minJoinBondBn, units);
  const minCreateBond = planckToUnitBn(minCreateBondBn, units);
  const minNominatorBond = planckToUnitBn(minNominatorBondBn, units);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  });

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // handler to set bond as a string
  const handleSetBond = (newBond: { bond: BigNumber }) => {
    setBond({ bond: newBond.bond.toString() });
  };

  // feedback errors to trigger modal resize
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([]);

  // get the max amount available to unbond
  const unbondToMin = isPooling
    ? isDepositor()
      ? BigNumber.max(freeToUnbond.minus(minCreateBond), 0)
      : BigNumber.max(freeToUnbond.minus(minJoinBond), 0)
    : BigNumber.max(freeToUnbond.minus(minNominatorBond), 0);

  // tx to submit
  const getTx = () => {
    const { pApi } = ApiController.get(network);
    let tx = null;
    if (!pApi || !activeAccount) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(
      !bondValid ? '0' : bond.bond,
      units
    ).toString();

    // determine tx
    if (isPooling) {
      tx = pApi.tx.NominationPools.unbond({
        member_account: { type: 'Id', value: activeAccount },
        unbonding_points: BigInt(bondToSubmit),
      });
    } else if (isStaking) {
      tx = pApi.tx.Staking.unbond({ value: BigInt(bondToSubmit) });
    }
    return tx;
  };

  const signingAccount = isPooling ? activeAccount : controller;

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const nominatorActiveBelowMin =
    bondFor === 'nominator' &&
    !activeBn.isZero() &&
    activeBn.isLessThan(minNominatorBondBn);

  const poolToMinBn = isDepositor() ? minCreateBondBn : minJoinBondBn;
  const poolActiveBelowMin =
    bondFor === 'pool' && activeBn.isLessThan(poolToMinBn);

  // accumulate warnings.
  const warnings = getSignerWarnings(
    activeAccount,
    isStaking,
    submitExtrinsic.proxySupported
  );

  if (pendingRewardsUnit.isGreaterThan(0) && bondFor === 'pool') {
    warnings.push(`${t('unbondingWithdraw')} ${pendingRewardsUnit} ${unit}.`);
  }
  if (nominatorActiveBelowMin) {
    warnings.push(
      t('unbondErrorBelowMinimum', {
        bond: minNominatorBond,
        unit,
      })
    );
  }
  if (poolActiveBelowMin) {
    warnings.push(
      t('unbondErrorBelowMinimum', {
        bond: planckToUnitBn(poolToMinBn, units),
        unit,
      })
    );
  }
  if (activeBn.isZero()) {
    warnings.push(t('unbondErrorNoFunds', { unit }));
  }

  // Update bond value on task change.
  useEffect(() => {
    handleSetBond({ bond: unbondToMin });
  }, [freeToUnbond.toString()]);

  // Modal resize on form update.
  useEffect(
    () => setModalResize(),
    [bond, notEnoughFunds, feedbackErrors.length, warnings.length]
  );

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('removeBond')}</h2>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}
        <UnbondFeedback
          bondFor={bondFor}
          listenIsValid={(valid, errors) => {
            setBondValid(valid);
            setFeedbackErrors(errors);
          }}
          setters={[handleSetBond]}
          txFees={txFees}
        />
        <ModalNotes withPadding>
          {bondFor === 'pool' ? (
            isDepositor() ? (
              <p>
                {t('notePoolDepositorMinBond', {
                  context: 'depositor',
                  bond: minCreateBond,
                  unit,
                })}
              </p>
            ) : (
              <p>
                {t('notePoolDepositorMinBond', {
                  context: 'member',
                  bond: minJoinBond,
                  unit,
                })}
              </p>
            )
          ) : null}
          <StaticNote
            value={bondDurationFormatted}
            tKey="onceUnbonding"
            valueKey="bondDurationFormatted"
            deps={[bondDuration]}
          />
        </ModalNotes>
      </ModalPadding>
      <SubmitTx
        noMargin
        fromController={isStaking}
        valid={bondValid}
        {...submitExtrinsic}
      />
    </>
  );
};
