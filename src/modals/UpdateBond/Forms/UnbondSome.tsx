// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { UnbondFeedback } from 'library/Form/Unbond/UnbondFeedback';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { NotesWrapper } from '../../Wrappers';
import { FormsProps } from '../types';
import { FormFooter } from './FormFooter';

export const UnbondSome = (props: FormsProps) => {
  const { setSection } = props;
  const { t } = useTranslation('common');

  const { api, network, consts } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { staking, getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const { bondType } = config;
  const { stats } = usePoolsConfig();
  const { isDepositor, selectedActivePool } = useActivePools();
  const { txFeesValid } = useTxFees();
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
  const { freeToUnbond: freeToUnbondBn } = isPooling
    ? allTransferOptions.pool
    : allTransferOptions.nominate;

  // convert BN values to number
  const freeToUnbond = planckBnToUnit(freeToUnbondBn, units);
  const minJoinBond = planckBnToUnit(minJoinBondBn, units);
  const minCreateBond = planckBnToUnit(minCreateBondBn, units);
  const minNominatorBond = planckBnToUnit(minNominatorBondBn, units);

  // local bond value
  const [bond, setBond] = useState({ bond: freeToUnbond });

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // get the max amount available to unbond
  const freeToUnbondToMin = isPooling
    ? isDepositor()
      ? Math.max(freeToUnbond - minCreateBond, 0)
      : Math.max(freeToUnbond - minJoinBond, 0)
    : Math.max(freeToUnbond - minNominatorBond, 0);

  // unbond some validation
  const isValid = isPooling ? true : !controllerNotImported;

  // update bond value on task change
  useEffect(() => {
    const _bond = freeToUnbondToMin;
    setBond({ bond: _bond });

    setBondValid(isValid);
  }, [freeToUnbondToMin, isValid]);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!bondValid || !api || !activeAccount) {
      return _tx;
    }
    // stake unbond: controller must be imported
    if (isStaking && controllerNotImported) {
      return _tx;
    }
    // remove decimal errors
    const bondToSubmit = unitToPlanckBn(bond.bond, units);

    // determine _tx
    if (isPooling) {
      _tx = api.tx.nominationPools.unbond(activeAccount, bondToSubmit);
    } else if (isStaking) {
      _tx = api.tx.staking.unbond(bondToSubmit);
    }
    return _tx;
  };

  const signingAccount = isPooling ? activeAccount : controller;

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: signingAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(2);
    },
    callbackInBlock: () => {},
  });

  const warnings = [];
  if (!accountHasSigner(activeAccount)) {
    warnings.push(t('modals.w1'));
  }

  return (
    <>
      <div className="items">
        <>
          {unclaimedRewards > 0 && bondType === 'pool' && (
            <Warning
              text={`Unbonding will also withdraw your outstanding rewards of ${unclaimedRewards} ${network.unit}.`}
            />
          )}
          <UnbondFeedback
            bondType={bondType}
            listenIsValid={setBondValid}
            defaultBond={freeToUnbondToMin}
            setters={[
              {
                set: setBond,
                current: bond,
              },
            ]}
            warnings={warnings}
          />
          <NotesWrapper>
            <p>{t('modals.update_bond4', { bondDuration })}</p>
            <EstimatedTxFee />
          </NotesWrapper>
        </>
      </div>
      <FormFooter
        setSection={setSection}
        submitTx={submitTx}
        submitting={submitting}
        isValid={bondValid && accountHasSigner(signingAccount) && txFeesValid}
      />
    </>
  );
};
