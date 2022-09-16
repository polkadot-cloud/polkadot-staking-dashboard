// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useBalances } from 'contexts/Balances';
import { useStaking } from 'contexts/Staking';
import { humanNumber, planckBnToUnit } from 'Utils';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import BN from 'bn.js';
import { useTxFees } from 'contexts/TxFees';
import { BN_ZERO } from '@polkadot/util';
import { BondInput } from '../BondInput';
import { Spacer } from '../Wrappers';
import { Warning } from '../Warning';
import { BondInputWithFeedbackProps } from '../types';

export const BondInputWithFeedback = (props: BondInputWithFeedbackProps) => {
  const { bondType, unbond } = props;
  const inSetup = props.inSetup ?? false;
  const warnings = props.warnings ?? [];
  const setters = props.setters ?? [];
  const listenIsValid = props.listenIsValid ?? (() => {});
  const disableTxFeeUpdate = props.disableTxFeeUpdate ?? false;
  const defaultBond = props.defaultBond || '';

  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { staking, getControllerNotImported } = useStaking();
  const { getLedgerForStash, getBondedAccount, getTransferOptions } =
    useBalances();
  const { getPoolTransferOptions, isDepositor } = useActivePool();
  const { stats } = usePoolsConfig();
  const { minJoinBond, minCreateBond } = stats;
  const { units } = network;
  const controller = getBondedAccount(activeAccount);
  const ledger = getLedgerForStash(activeAccount);
  const { txFees } = useTxFees();
  const { active } = ledger;
  const { minNominatorBond } = staking;

  // get bond options for either staking or pooling.
  const transferOptions =
    bondType === 'pool'
      ? getPoolTransferOptions(activeAccount)
      : getTransferOptions(activeAccount);

  const {
    freeBalance: freeBalanceBn,
    freeToUnbond: freeToUnbondBn,
    active: poolsActive,
  } = transferOptions;

  // if we are bonding, subtract tx fees from bond amount
  const freeBondAmount = unbond
    ? freeBalanceBn
    : !disableTxFeeUpdate
    ? BN.max(freeBalanceBn.sub(txFees), BN_ZERO)
    : freeBalanceBn;

  // the default bond balance
  const freeBalance = planckBnToUnit(freeBondAmount, units);

  // store errors
  const [errors, setErrors] = useState<Array<string>>([]);

  // local bond state
  const [bond, setBond] = useState<{ bond: number | string }>({
    bond: defaultBond,
  });

  // whether bond is disabled
  const [bondDisabled, setBondDisabled] = useState(false);

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: defaultBond,
    });
  }, [activeAccount]);

  // handle errors on input change
  useEffect(() => {
    handleErrors();
  }, [bond, txFees]);

  // if resize is present, handle on error change
  useEffect(() => {
    if (props.setLocalResize) props.setLocalResize();
  }, [errors]);

  // update max bond after txFee sync
  useEffect(() => {
    if (!unbond && !disableTxFeeUpdate) {
      if (Number(bond.bond) > freeBalance) {
        setBond({ bond: freeBalance });
      }
    }
  }, [txFees]);

  // add this component's setBond to setters
  setters.push({
    set: setBond,
    current: bond,
  });

  // bond amount to minimum threshold
  const minBondBase =
    bondType === 'pool'
      ? inSetup || isDepositor()
        ? planckBnToUnit(minCreateBond, units)
        : planckBnToUnit(minJoinBond, units)
      : planckBnToUnit(minNominatorBond, units);

  // unbond amount to minimum threshold
  const freeToUnbondToMin =
    bondType === 'pool'
      ? inSetup || isDepositor()
        ? planckBnToUnit(
            BN.max(freeToUnbondBn.sub(minCreateBond), new BN(0)),
            units
          )
        : planckBnToUnit(
            BN.max(freeToUnbondBn.sub(minJoinBond), new BN(0)),
            units
          )
      : planckBnToUnit(
          BN.max(freeToUnbondBn.sub(minNominatorBond), new BN(0)),
          units
        );

  // get the actively bonded amount.
  const activeBase =
    bondType === 'pool'
      ? planckBnToUnit(poolsActive, units)
      : planckBnToUnit(active, units);

  // handle error updates
  const handleErrors = () => {
    let _bondDisabled = false;
    const _errors = warnings;
    const _bond = bond.bond;

    // bond errors
    if (!unbond) {
      if (freeBalance === 0) {
        _bondDisabled = true;
        _errors.push(`You have no free ${network.unit} to bond.`);
      }

      if (Number(bond.bond) > freeBalance) {
        _errors.push('Bond amount is more than your free balance.');
      }

      // bond errors
      if (inSetup) {
        if (freeBalance < minBondBase) {
          _bondDisabled = true;
          _errors.push(
            `You do not meet the minimum bond of ${minBondBase} ${network.unit}.`
          );
        }
        if (Number(bond.bond) < minBondBase) {
          _errors.push(
            `Bond amount must be at least ${minBondBase} ${network.unit}.`
          );
        }
      }
    }

    // unbond errors
    if (unbond) {
      if (Number(bond.bond) > activeBase) {
        _errors.push('Unbond amount is more than your bonded balance.');
      }

      // unbond errors for staking only
      if (bondType === 'stake') {
        if (getControllerNotImported(controller)) {
          _errors.push(
            'You must have your controller account imported to unbond.'
          );
        }
      }

      if (Number(bond.bond) > freeToUnbondToMin) {
        _errors.push(
          `A minimum bond of ${minBondBase} ${network.unit} is required ${
            bondType === 'stake'
              ? `when actively nominating`
              : isDepositor()
              ? `as the pool depositor`
              : `as a pool member`
          }.`
        );
      }
    }
    const bondValid = !_errors.length && _bond !== '';

    setBondDisabled(_bondDisabled);
    listenIsValid(bondValid);
    setErrors(_errors);
  };

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          {unbond
            ? 'Bonded'
            : `${txFees.isZero() ? `Available` : `Available after Tx Fees`}`}
          : {unbond ? humanNumber(activeBase) : humanNumber(freeBalance)}{' '}
          {network.unit}
        </h4>
      </CardHeaderWrapper>
      {errors.map((err: string, index: number) => (
        <Warning key={`setup_error_${index}`} text={err} />
      ))}
      <Spacer />
      <BondInput
        task={unbond ? 'unbond' : 'bond'}
        value={bond.bond}
        defaultValue={defaultBond}
        disabled={bondDisabled}
        setters={setters}
        freeBalance={freeBalance}
        freeToUnbondToMin={freeToUnbondToMin}
        disableTxFeeUpdate={disableTxFeeUpdate}
      />
    </>
  );
};

export default BondInputWithFeedback;
