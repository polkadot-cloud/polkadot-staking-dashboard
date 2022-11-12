// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useEffect, useState } from 'react';
import { planckBnToUnit } from 'Utils';
import { UnbondFeedbackProps } from '../types';
import { Warning } from '../Warning';
import { Spacer } from '../Wrappers';
import { UnbondInput } from './UnbondInput';

export const UnbondFeedback = ({
  bondType,
  inSetup = false,
  warnings = [],
  setters = [],
  listenIsValid = () => {},
  defaultBond,
  setLocalResize,
  txFees,
}: UnbondFeedbackProps) => {
  const defaultValue = defaultBond || '';

  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { staking, getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const { getTransferOptions } = useTransferOptions();
  const { isDepositor } = useActivePools();
  const { stats } = usePoolsConfig();
  const { minJoinBond, minCreateBond } = stats;
  const { units } = network;
  const controller = getBondedAccount(activeAccount);
  const { minNominatorBond } = staking;
  const allTransferOptions = getTransferOptions(activeAccount);

  // get bond options for either staking or pooling.
  const transferOptions =
    bondType === 'pool' ? allTransferOptions.pool : allTransferOptions.nominate;

  const { freeToUnbond: freeToUnbondBn, active } = transferOptions;

  // store errors
  const [errors, setErrors] = useState<Array<string>>([]);

  // local bond state
  const [bond, setBond] = useState<{ bond: number | string }>({
    bond: defaultValue,
  });

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: defaultValue,
    });
  }, [activeAccount]);

  // handle errors on input change
  useEffect(() => {
    handleErrors();
  }, [bond, txFees]);

  // if resize is present, handle on error change
  useEffect(() => {
    if (setLocalResize) setLocalResize();
  }, [errors]);

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
  const activeBase = planckBnToUnit(active, units);

  // handle error updates
  const handleErrors = () => {
    const _errors = [...warnings];
    const _bond = bond.bond;
    const _planck = 1 / new BN(10).pow(new BN(units)).toNumber();

    // unbond errors
    if (Number(bond.bond) > activeBase)
      _errors.push('Unbond amount is more than your bonded balance.');

    // unbond errors for staking only
    if (bondType === 'stake')
      if (getControllerNotImported(controller))
        _errors.push(
          'You must have your controller account imported to unbond.'
        );

    if (bond.bond !== '' && Number(bond.bond) < _planck)
      _errors.push('Value is too small');

    if (Number(bond.bond) > freeToUnbondToMin)
      _errors.push(
        `A minimum bond of ${minBondBase} ${network.unit} is required ${
          bondType === 'stake'
            ? `when actively nominating`
            : isDepositor()
            ? `as the pool depositor`
            : `as a pool member`
        }.`
      );

    listenIsValid(!_errors.length && _bond !== '');
    setErrors(_errors);
  };

  return (
    <>
      {errors.map((err: string, index: number) => (
        <Warning key={`unbond_error_${index}`} text={err} />
      ))}
      <Spacer />
      <UnbondInput
        active={active}
        defaultValue={defaultValue}
        disabled={false}
        freeToUnbondToMin={freeToUnbondToMin}
        setters={setters}
        value={bond.bond}
      />
    </>
  );
};

export default UnbondFeedback;
