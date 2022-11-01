// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { FormFooter } from './FormFooter';
import { NotesWrapper, Separator } from '../../Wrappers';
import { FormsProps } from '../types';

export const UnbondAll = (props: FormsProps) => {
  const { setSection } = props;
  const { t } = useTranslation('common');

  const { api, network, consts } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize, config } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { getControllerNotImported } = useStaking();
  const { getBondedAccount, getAccountNominations } = useBalances();
  const { bondType } = config;
  const { getTransferOptions } = useTransferOptions();
  const { txFeesValid } = useTxFees();
  const { selectedActivePool } = useActivePools();

  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);
  unclaimedRewards = planckBnToUnit(unclaimedRewards, network.units);

  const controller = getBondedAccount(activeAccount);
  const nominations = getAccountNominations(activeAccount);
  const controllerNotImported = getControllerNotImported(controller);

  const { bondDuration } = consts;
  const isStaking = bondType === 'stake';
  const isPooling = bondType === 'pool';

  const allTransferOptions = getTransferOptions(activeAccount);
  const { freeToUnbond: freeToUnbondBn } = isPooling
    ? allTransferOptions.pool
    : allTransferOptions.nominate;

  // convert BN values to number
  const freeToUnbond = planckBnToUnit(freeToUnbondBn, units);

  // local bond value
  const [bond, setBond] = useState({
    bond: freeToUnbond,
  });

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // unbond all validation
  const isValid = (() => {
    let _isValid = false;
    if (isPooling) {
      _isValid = freeToUnbond > 0;
    } else {
      _isValid =
        freeToUnbond > 0 && nominations.length === 0 && !controllerNotImported;
    }
    return _isValid;
  })();

  // update bond value on task change
  useEffect(() => {
    const _bond = freeToUnbond;
    setBond({ bond: _bond });
    setBondValid(isValid);
  }, [freeToUnbond, isValid]);

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

  return (
    <>
      <div className="items">
        <>
          {!accountHasSigner(signingAccount) && (
            <Warning text={t('modals.w1')} />
          )}
          {isStaking && controllerNotImported ? (
            <Warning text={t('modals.w9')} />
          ) : (
            <></>
          )}
          {isStaking && nominations.length ? (
            <Warning text={t('modals.w10')} />
          ) : (
            <></>
          )}
          {unclaimedRewards > 0 && (
            <Warning
              text={`Unbonding will also withdraw your outstanding rewards of ${unclaimedRewards} ${network.unit}.`}
            />
          )}
          <h4>{t('modals.amount_to_unbond')}</h4>
          <h2>
            {freeToUnbond} {network.unit}
          </h2>
          <Separator />
          <NotesWrapper>
            <p>{t('modals.update_bond4', { bondDuration })}</p>
            {bondValid && <EstimatedTxFee />}
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
