// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowAltCircleUp, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { UnbondFeedback } from 'library/Form/Unbond/UnbondFeedback';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { Title } from 'library/Modal/Title';
import { FooterWrapper, NotesWrapper, PaddingWrapper } from 'modals/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';

export const Unbond = () => {
  const { t } = useTranslation('modals');
  const { api, network, consts } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { staking, getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const { bondType } = config;
  const { stats } = usePoolsConfig();
  const { isDepositor, selectedActivePool } = useActivePools();
  const { txFees, txFeesValid } = useTxFees();
  const { getTransferOptions } = useTransferOptions();

  const controller = getBondedAccount(activeAccount);
  const controllerNotImported = getControllerNotImported(controller);
  const { minNominatorBond: minNominatorBondBn } = staking;
  const { minJoinBond: minJoinBondBn, minCreateBond: minCreateBondBn } = stats;
  const { bondDuration } = consts;

  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);
  unclaimedRewards = planckBnToUnit(unclaimedRewards, network.units);

  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';

  const allTransferOptions = getTransferOptions(activeAccount);
  const { active: activeBn } = isPooling
    ? allTransferOptions.pool
    : allTransferOptions.nominate;

  // convert BN values to number
  const freeToUnbond = planckBnToUnit(activeBn, units);
  const minJoinBond = planckBnToUnit(minJoinBondBn, units);
  const minCreateBond = planckBnToUnit(minCreateBondBn, units);
  const minNominatorBond = planckBnToUnit(minNominatorBondBn, units);

  // local bond value
  const [bond, setBond] = useState({ bond: freeToUnbond });

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // get the max amount available to unbond
  const unbondToMin = isPooling
    ? isDepositor()
      ? Math.max(freeToUnbond - minCreateBond, 0)
      : Math.max(freeToUnbond - minJoinBond, 0)
    : Math.max(freeToUnbond - minNominatorBond, 0);

  // unbond some validation
  const isValid = isPooling ? true : !controllerNotImported;

  // update bond value on task change
  useEffect(() => {
    const _bond = unbondToMin;
    setBond({ bond: _bond });

    setBondValid(isValid);
  }, [unbondToMin, isValid]);

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
    // stake unbond: controller must be imported
    if (isStaking && controllerNotImported) {
      return tx;
    }
    // remove decimal errors
    const bondToSubmit = unitToPlanckBn(String(bond.bond), units);

    // determine tx
    if (isPooling) {
      tx = api.tx.nominationPools.unbond(activeAccount, bondToSubmit);
    } else if (isStaking) {
      tx = api.tx.staking.unbond(bondToSubmit);
    }
    return tx;
  };

  const signingAccount = isPooling ? activeAccount : controller;

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const nominatorActiveBelowMin =
    bondType === 'stake' &&
    !activeBn.isZero() &&
    activeBn.lt(minNominatorBondBn);

  const poolToMinBn = isDepositor() ? minCreateBondBn : minJoinBondBn;
  const poolActiveBelowMin = bondType === 'pool' && activeBn.lt(poolToMinBn);

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(t('readOnly'));
  }

  if (unclaimedRewards > 0 && bondType === 'pool') {
    warnings.push(
      `${t('unbondingWithdraw')} ${unclaimedRewards} ${network.unit}.`
    );
  }
  if (nominatorActiveBelowMin) {
    warnings.push(
      `Unable to unbond. Your bonded funds are below the minumum of ${minNominatorBond} ${network.unit}.`
    );
  }
  if (poolActiveBelowMin) {
    warnings.push(
      `Unable to unbond. Your bonded funds are below the minumum of ${planckBnToUnit(
        poolToMinBn,
        units
      )} ${network.unit}.`
    );
  }
  if (activeBn.isZero()) {
    warnings.push(`You have no ${network.unit} to unbond.`);
  }

  return (
    <>
      <Title title={`${t('remove')} ${t('bond')}`} icon={faMinus} />
      <PaddingWrapper>
        <UnbondFeedback
          bondType={bondType}
          listenIsValid={setBondValid}
          setters={[
            {
              set: setBond,
              current: bond,
            },
          ]}
          warnings={warnings}
          txFees={txFees}
        />
        <NotesWrapper>
          {bondType === 'pool' ? (
            <>
              {isDepositor() ? (
                <p>
                  As the pool depositor you must maintain a bond of at least{' '}
                  {minCreateBond} {network.unit}.
                </p>
              ) : (
                <p>
                  As a pool member you must maintain a bond of at least{' '}
                  {minJoinBond} {network.unit}.
                </p>
              )}
            </>
          ) : null}
          <p>{t('onceUnbonding', { bondDuration })}</p>
          <EstimatedTxFee />
        </NotesWrapper>
        <FooterWrapper>
          <div>
            <ButtonSubmit
              text={`${submitting ? t('submitting') : t('submit')}`}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => submitTx()}
              disabled={
                submitting ||
                !(bondValid && accountHasSigner(signingAccount) && txFeesValid)
              }
            />
          </div>
        </FooterWrapper>
      </PaddingWrapper>
    </>
  );
};
