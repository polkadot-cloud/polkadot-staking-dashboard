// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useState, useEffect } from 'react';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useBalances } from 'contexts/Balances';
import { useStaking } from 'contexts/Staking';
import { humanNumber, planckBnToUnit } from 'Utils';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useTxFees } from 'contexts/TxFees';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';
import { UnbondInput } from './UnbondInput';
import { Spacer } from '../Wrappers';
import { Warning } from '../Warning';
import { UnbondFeedbackProps } from '../types';

export const UnbondFeedback = (props: UnbondFeedbackProps) => {
  const { bondType } = props;
  const inSetup = props.inSetup ?? false;
  const warnings = props.warnings ?? [];
  const setters = props.setters ?? [];
  const listenIsValid = props.listenIsValid ?? (() => {});
  const defaultBond = props.defaultBond || '';
  const { t } = useTranslation('common');

  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { staking, getControllerNotImported } = useStaking();
  const { getBondedAccount } = useBalances();
  const { getTransferOptions } = useTransferOptions();
  const { isDepositor } = useActivePool();
  const { stats } = usePoolsConfig();
  const { minJoinBond, minCreateBond } = stats;
  const { units } = network;
  const controller = getBondedAccount(activeAccount);
  const { txFees } = useTxFees();
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
    bond: defaultBond,
  });

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
    const _errors = warnings;
    const _bond = bond.bond;
    const _planck = 1 / new BN(10).pow(new BN(units)).toNumber();

    // unbond errors
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

    if (bond.bond !== '' && Number(bond.bond) < _planck) {
      _errors.push('Value is too small');
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
    const bondValid = !_errors.length && _bond !== '';

    listenIsValid(bondValid);
    setErrors(_errors);
  };

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          Bonded: {humanNumber(activeBase)} {network.unit}
        </h4>
      </CardHeaderWrapper>
      {errors.map((err: string, index: number) => (
        <Warning key={`unbond_error_${index}`} text={err} />
      ))}
      <Spacer />
      <UnbondInput
        defaultValue={defaultBond}
        disabled={false}
        freeToUnbondToMin={freeToUnbondToMin}
        setters={setters}
        value={bond.bond}
      />
    </>
  );
};

export default UnbondFeedback;
