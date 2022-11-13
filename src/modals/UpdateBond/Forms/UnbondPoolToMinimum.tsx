// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTxFees } from 'contexts/TxFees';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { Warning } from 'library/Form/Warning';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useEffect, useState } from 'react';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { NotesWrapper, Separator } from '../../Wrappers';
import { FormsProps } from '../types';
import { FormFooter } from './FormFooter';

export const UnbondPoolToMinimum = (props: FormsProps) => {
  const { setSection } = props;

  const { api, network, consts } = useApi();
  const { units } = network;
  const { setStatus: setModalStatus, setResize } = useModal();
  const { activeAccount, accountHasSigner } = useConnect();
  const { isDepositor, selectedActivePool } = useActivePools();
  const { getTransferOptions } = useTransferOptions();
  const { stats } = usePoolsConfig();
  const { txFeesValid } = useTxFees();

  let { unclaimedRewards } = selectedActivePool || {};
  unclaimedRewards = unclaimedRewards ?? new BN(0);
  unclaimedRewards = planckBnToUnit(unclaimedRewards, network.units);

  const { minJoinBond, minCreateBond } = stats;
  const { bondDuration } = consts;

  const { freeToUnbond: freeToUnbondBn } =
    getTransferOptions(activeAccount).pool;

  // unbond amount to minimum threshold
  const freeToUnbond = isDepositor()
    ? planckBnToUnit(
        BN.max(freeToUnbondBn.sub(minCreateBond), new BN(0)),
        units
      )
    : planckBnToUnit(BN.max(freeToUnbondBn.sub(minJoinBond), new BN(0)), units);

  // local bond value
  const [bond, setBond] = useState({
    bond: freeToUnbond,
  });

  // bond valid
  const [bondValid, setBondValid] = useState(false);

  // unbond all validation
  const isValid = (() => {
    return freeToUnbond > 0;
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
  const getTx = () => {
    let tx = null;
    if (!bondValid || !api || !activeAccount) {
      return tx;
    }

    // remove decimal errors
    const bondToSubmit = unitToPlanckBn(bond.bond, units);

    tx = api.tx.nominationPools.unbond(activeAccount, bondToSubmit);
    return tx;
  };

  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
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
          {!accountHasSigner(activeAccount) && (
            <Warning text="Your account is read only, and cannot sign transactions." />
          )}
          {unclaimedRewards > 0 && (
            <Warning
              text={`Unbonding will also withdraw your outstanding rewards of ${unclaimedRewards} ${network.unit}.`}
            />
          )}
          <h4>Amount to unbond:</h4>
          <h2>
            {freeToUnbond} {network.unit}
          </h2>
          <Separator />
          <NotesWrapper>
            <p>
              Once unbonding, you must wait {bondDuration} eras for your funds
              to become available.
            </p>
            {bondValid && <EstimatedTxFee />}
          </NotesWrapper>
        </>
      </div>
      <FormFooter
        setSection={setSection}
        submitTx={submitTx}
        submitting={submitting}
        isValid={bondValid && accountHasSigner(activeAccount) && txFeesValid}
      />
    </>
  );
};
