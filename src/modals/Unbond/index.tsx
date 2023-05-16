// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isNotZero, planckToUnit, unitToPlanck } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxMeta } from 'contexts/TxMeta';
import { getUnixTime } from 'date-fns';
import { UnbondFeedback } from 'library/Form/Unbond/UnbondFeedback';
import { Warning } from 'library/Form/Warning';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useSignerWarnings } from 'library/Hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { Close } from 'library/Modal/Close';
import { SubmitTx } from 'library/SubmitTx';
import { StaticNote } from 'modals/Utils/StaticNote';
import { NotesWrapper, PaddingWrapper, WarningsWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Unbond = () => {
  const { t } = useTranslation('modals');
  const { api, network, consts } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize, config } = useModal();
  const { activeAccount } = useConnect();
  const { staking } = useStaking();
  const { getBondedAccount } = useBonded();
  const { bondFor } = config;
  const { stats } = usePoolsConfig();
  const { isDepositor, selectedActivePool } = useActivePools();
  const { txFees } = useTxMeta();
  const { getTransferOptions } = useTransferOptions();
  const { erasToSeconds } = useErasToTimeLeft();
  const { getSignerWarnings } = useSignerWarnings();

  const controller = getBondedAccount(activeAccount);
  const { minNominatorBond: minNominatorBondBn } = staking;
  const { minJoinBond: minJoinBondBn, minCreateBond: minCreateBondBn } = stats;
  const { bondDuration } = consts;

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  );

  let { pendingRewards } = selectedActivePool || {};
  pendingRewards = pendingRewards ?? new BigNumber(0);
  pendingRewards = planckToUnit(pendingRewards, network.units);

  const isStaking = bondFor === 'nominator';
  const isPooling = bondFor === 'pool';

  const allTransferOptions = getTransferOptions(activeAccount);
  const { active: activeBn } = isPooling
    ? allTransferOptions.pool
    : allTransferOptions.nominate;

  // convert BigNumber values to number
  const freeToUnbond = planckToUnit(activeBn, units);
  const minJoinBond = planckToUnit(minJoinBondBn, units);
  const minCreateBond = planckToUnit(minCreateBondBn, units);
  const minNominatorBond = planckToUnit(minNominatorBondBn, units);

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  });

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // get the max amount available to unbond
  const unbondToMin = isPooling
    ? isDepositor()
      ? BigNumber.max(freeToUnbond.minus(minCreateBond), 0)
      : BigNumber.max(freeToUnbond.minus(minJoinBond), 0)
    : BigNumber.max(freeToUnbond.minus(minNominatorBond), 0);

  // update bond value on task change
  useEffect(() => {
    setBond({ bond: unbondToMin.toString() });
  }, [freeToUnbond.toString()]);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const getTx = () => {
    let tx = null;
    if (!bondValid || !api || !activeAccount) {
      return tx;
    }

    const bondToSubmit = unitToPlanck(bond.bond, units);
    const bondAsString = bondToSubmit.isNaN() ? '0' : bondToSubmit.toString();

    // determine tx
    if (isPooling) {
      tx = api.tx.nominationPools.unbond(activeAccount, bondAsString);
    } else if (isStaking) {
      tx = api.tx.staking.unbond(bondAsString);
    }
    return tx;
  };

  const signingAccount = isPooling ? activeAccount : controller;

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const nominatorActiveBelowMin =
    bondFor === 'nominator' &&
    isNotZero(activeBn) &&
    activeBn.isLessThan(minNominatorBondBn);

  const poolToMinBn = isDepositor() ? minCreateBondBn : minJoinBondBn;
  const poolActiveBelowMin =
    bondFor === 'pool' && activeBn.isLessThan(poolToMinBn);

  // accumulate warnings.
  const warnings = getSignerWarnings(activeAccount, isStaking);

  if (pendingRewards > 0 && bondFor === 'pool') {
    warnings.push(
      `${t('unbondingWithdraw')} ${pendingRewards} ${network.unit}.`
    );
  }
  if (nominatorActiveBelowMin) {
    warnings.push(
      t('unbondErrorBelowMinimum', {
        bond: minNominatorBond,
        unit: network.unit,
      })
    );
  }
  if (poolActiveBelowMin) {
    warnings.push(
      t('unbondErrorBelowMinimum', {
        bond: planckToUnit(poolToMinBn, units),
        unit: network.unit,
      })
    );
  }
  if (activeBn.isZero()) {
    warnings.push(t('unbondErrorNoFunds', { unit: network.unit }));
  }

  return (
    <>
      <Close />
      <PaddingWrapper>
        <h2 className="title unbounded">{`${t('removeBond')}`}</h2>
        {warnings.length > 0 ? (
          <WarningsWrapper>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </WarningsWrapper>
        ) : null}
        <UnbondFeedback
          bondFor={bondFor}
          listenIsValid={setBondValid}
          setters={[
            {
              set: setBond,
              current: bond,
            },
          ]}
          txFees={txFees}
        />
        <NotesWrapper>
          {bondFor === 'pool' ? (
            <>
              {isDepositor() ? (
                <p>
                  {t('notePoolDepositorMinBond', {
                    context: 'depositor',
                    bond: minCreateBond,
                    unit: network.unit,
                  })}
                </p>
              ) : (
                <p>
                  {t('notePoolDepositorMinBond', {
                    context: 'member',
                    bond: minJoinBond,
                    unit: network.unit,
                  })}
                </p>
              )}
            </>
          ) : null}
          <StaticNote
            value={bondDurationFormatted}
            tKey="onceUnbonding"
            valueKey="bondDurationFormatted"
            deps={[bondDuration]}
          />
        </NotesWrapper>
      </PaddingWrapper>
      <SubmitTx
        fromController={isStaking}
        valid={bondValid}
        {...submitExtrinsic}
      />
    </>
  );
};
