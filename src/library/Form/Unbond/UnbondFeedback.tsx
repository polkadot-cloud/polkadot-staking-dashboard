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
import { useTranslation } from 'react-i18next';
import { useTxFees } from 'contexts/TxFees';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { useEffect, useState } from 'react';
import { humanNumber, planckBnToUnit } from 'Utils';
import { Warning } from '../Warning';
import { Spacer } from '../Wrappers';
import { UnbondInput } from './UnbondInput';
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
  const { isDepositor } = useActivePools();
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
      _errors.push(t('library.w6'));
    }

    // unbond errors for staking only
    if (bondType === 'stake') {
      if (getControllerNotImported(controller)) {
        _errors.push(t('library.w9'));
      }
    }

    if (bond.bond !== '' && Number(bond.bond) < _planck) {
      _errors.push(t('library.value_is_too_small'));
    }

    if (Number(bond.bond) > freeToUnbondToMin) {
      const unit = network.unit;
      _errors.push(
        `${t('library.minimum_bond', { minBondBase, unit })}${
          bondType === 'stake'
            ? `${t('library.when_actively_nominating')}`
            : isDepositor()
            ? `${t('library.as_the_pool_depositor')}`
            : `${t('library.as_a_pool_member')}`
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
          {t('library.bonded')} {humanNumber(activeBase)} {network.unit}
        </h4>
      </CardHeaderWrapper>
      {errors.map((err: string, index: number) => (
        <Warning key={`unbond_error_${index} `} text={err} />
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
