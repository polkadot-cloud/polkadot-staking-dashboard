// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useState, useEffect } from 'react';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useStaking } from 'contexts/Staking';
import { planckBnToUnit } from 'Utils';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useTxFees } from 'contexts/TxFees';
import { BN_ZERO } from '@polkadot/util';
import { useTransferOptions } from 'contexts/TransferOptions';
import { BondInput } from './BondInput';
import { Spacer } from '../Wrappers';
import { Warning } from '../Warning';
import { BondFeedbackProps } from '../types';

export const BondFeedback = (props: BondFeedbackProps) => {
  const { bondType } = props;
  const inSetup = props.inSetup ?? false;
  const warnings = props.warnings ?? [];
  const setters = props.setters ?? [];
  const listenIsValid = props.listenIsValid ?? (() => {});
  const disableTxFeeUpdate = props.disableTxFeeUpdate ?? false;
  const defaultBond = props.defaultBond || '';

  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { staking } = useStaking();
  const { getTransferOptions } = useTransferOptions();
  const { isDepositor } = useActivePool();
  const { stats } = usePoolsConfig();
  const { minJoinBond, minCreateBond } = stats;
  const { units } = network;
  const { txFees } = useTxFees();
  const { minNominatorBond } = staking;

  const allTransferOptions = getTransferOptions(activeAccount);

  // get bond options for either staking or pooling.
  const { freeBalance: freeBalanceBn } = allTransferOptions;

  // if we are bonding, subtract tx fees from bond amount
  const freeBondAmount = !disableTxFeeUpdate
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
    if (!disableTxFeeUpdate) {
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

  // handle error updates
  const handleErrors = () => {
    let _bondDisabled = false;
    const _errors = warnings;
    const _bond = bond.bond;

    // bond errors
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

    const bondValid = !_errors.length && _bond !== '';

    setBondDisabled(_bondDisabled);
    listenIsValid(bondValid);
    setErrors(_errors);
  };

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          {`${txFees.isZero() ? `Available` : `Available after Tx Fees`}`}:{' '}
          humanNumber(freeBalance) {network.unit}
        </h4>
      </CardHeaderWrapper>
      {errors.map((err: string, index: number) => (
        <Warning key={`setup_error_${index}`} text={err} />
      ))}
      <Spacer />
      <BondInput
        value={bond.bond}
        defaultValue={defaultBond}
        disabled={bondDisabled}
        setters={setters}
        freeBalance={freeBalance}
        disableTxFeeUpdate={disableTxFeeUpdate}
      />
    </>
  );
};

export default BondFeedback;
