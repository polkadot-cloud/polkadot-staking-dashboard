// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN_ZERO } from '@polkadot/util';
import BN, { max } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { BondFeedbackProps } from '../types';
import { Warning } from '../Warning';
import { Spacer } from '../Wrappers';
import { BondInput } from './BondInput';

export const BondFeedback = ({
  bondType,
  inSetup = false,
  warnings = [],
  setters = [],
  listenIsValid = () => {},
  disableTxFeeUpdate = false,
  defaultBond,
  txFees,
  maxWidth,
  syncing = false,
}: BondFeedbackProps) => {
  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { staking } = useStaking();
  const { getTransferOptions } = useTransferOptions();
  const { isDepositor } = useActivePools();
  const { stats } = usePoolsConfig();
  const { minJoinBond, minCreateBond } = stats;
  const { units, unit } = network;
  const { minNominatorBond } = staking;
  const { t } = useTranslation('library');

  const defaultBondStr = defaultBond ? String(defaultBond) : '';

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
  const [bond, setBond] = useState<{ bond: string }>({
    bond: defaultBondStr,
  });

  // whether bond is disabled
  const [bondDisabled, setBondDisabled] = useState(false);

  // bond minus tx fees if too much
  const enoughToCoverTxFees: boolean =
    freeBalance - Number(bond.bond) > planckBnToUnit(txFees, units);

  const bondAfterTxFees = enoughToCoverTxFees
    ? unitToPlanckBn(bond.bond, units)
    : max(unitToPlanckBn(bond.bond, units).sub(txFees), new BN(0));

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: defaultBondStr,
    });
  }, [activeAccount]);

  // handle errors on input change
  useEffect(() => {
    handleErrors();
  }, [bond, txFees]);

  // update max bond after txFee sync
  useEffect(() => {
    if (!disableTxFeeUpdate) {
      if (Number(bond.bond) > freeBalance) {
        setBond({ bond: String(freeBalance) });
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
    let disabled = false;
    const _errors = warnings;
    const _planck = 1 / new BN(10).pow(new BN(units)).toNumber();
    const _decimals = bond.bond.toString().split('.')[1]?.length ?? 0;
    // const _maxSafe = new BN(Number.MAX_SAFE_INTEGER);

    // bond errors
    if (freeBalance === 0) {
      disabled = true;
      _errors.push(`${t('noFree', { unit })}`);
    }

    // bond amount must not surpass freeBalalance
    if (Number(bond.bond) > freeBalance) {
      _errors.push(t('moreThanBalance'));
    }

    // bond amount must not be smaller than 1 planck
    if (bond.bond !== '' && Number(bond.bond) < _planck) {
      _errors.push(t('tooSmall'));
    }

    // check bond after transaction fees is still valid
    if (bond.bond !== '' && bondAfterTxFees.lt(new BN(0))) {
      _errors.push(`${t('notEnoughAfter', { unit })}`);
    }

    // cbond amount must not surpass network supported units
    if (_decimals > units) {
      _errors.push(`Bond amount can only have at most ${units} decimals.`);
    }

    if (inSetup) {
      if (freeBalance < minBondBase) {
        disabled = true;
        _errors.push(`${t('notMeet')} ${minBondBase} ${unit}.`);
      }
      // bond amount must be more than minimum required bond
      if (bond.bond !== '' && Number(bond.bond) < minBondBase) {
        _errors.push(`${t('atLeast')} ${minBondBase} ${unit}.`);
      }
    }

    const bondValid = !_errors.length && bond.bond !== '';
    setBondDisabled(disabled);
    listenIsValid(bondValid);
    setErrors(_errors);
  };

  return (
    <>
      {errors.map((err: string, index: number) => (
        <Warning key={`setup_error_${index}`} text={err} />
      ))}
      <Spacer />
      <div style={{ maxWidth: maxWidth ? '500px' : '100%' }}>
        <BondInput
          value={String(bond.bond)}
          defaultValue={defaultBondStr}
          syncing={syncing}
          disabled={bondDisabled}
          setters={setters}
          freeBalance={freeBalance}
          disableTxFeeUpdate={disableTxFeeUpdate}
        />
      </div>
    </>
  );
};

export default BondFeedback;
