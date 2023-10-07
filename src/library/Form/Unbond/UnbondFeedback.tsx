// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isNotZero, planckToUnit, unitToPlanck } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Warning } from '../Warning';
import { Spacer } from '../Wrappers';
import type { UnbondFeedbackProps } from '../types';
import { UnbondInput } from './UnbondInput';

export const UnbondFeedback = ({
  bondFor,
  inSetup = false,
  setters = [],
  listenIsValid = () => {},
  defaultBond,
  setLocalResize,
  parentErrors = [],
  txFees,
}: UnbondFeedbackProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { activeAccount } = useActiveAccounts();
  const { staking } = useStaking();
  const { getTransferOptions } = useTransferOptions();
  const { isDepositor } = useActivePools();
  const { stats } = usePoolsConfig();
  const { minJoinBond, minCreateBond } = stats;
  const { minNominatorBond } = staking;
  const allTransferOptions = getTransferOptions(activeAccount);

  const defaultValue = defaultBond ? String(defaultBond) : '';

  // get bond options for either nominating or pooling.
  const transferOptions =
    bondFor === 'pool' ? allTransferOptions.pool : allTransferOptions.nominate;
  const { active } = transferOptions;

  // store errors
  const [errors, setErrors] = useState<string[]>([]);

  // local bond state
  const [bond, setBond] = useState<{ bond: string }>({
    bond: defaultValue,
  });

  // current bond value BigNumber
  const bondBn = unitToPlanck(String(bond.bond), units);

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
  const minBondBn =
    bondFor === 'pool'
      ? inSetup || isDepositor()
        ? minCreateBond
        : minJoinBond
      : minNominatorBond;
  const minBondUnit = planckToUnit(minBondBn, units);

  // unbond amount to minimum threshold
  const unbondToMin =
    bondFor === 'pool'
      ? inSetup || isDepositor()
        ? BigNumber.max(active.minus(minCreateBond), 0)
        : BigNumber.max(active.minus(minJoinBond), 0)
      : BigNumber.max(active.minus(minNominatorBond), 0);

  // check if bonded is below the minimum required
  const nominatorActiveBelowMin =
    bondFor === 'nominator' &&
    isNotZero(active) &&
    active.isLessThan(minNominatorBond);
  const poolToMinBn = isDepositor() ? minCreateBond : minJoinBond;
  const poolActiveBelowMin =
    bondFor === 'pool' && active.isLessThan(poolToMinBn);

  // handle error updates
  const handleErrors = () => {
    const newErrors = parentErrors;
    const decimals = bond.bond.toString().split('.')[1]?.length ?? 0;

    if (bondBn.isGreaterThan(active)) {
      newErrors.push(t('unbondAmount'));
    }

    if (bond.bond !== '' && bondBn.isLessThan(1)) {
      newErrors.push(t('valueTooSmall'));
    }

    if (decimals > units) {
      newErrors.push(`${t('bondAmountDecimals', { unit })}`);
    }

    if (bondBn.isGreaterThan(unbondToMin)) {
      // start the error message stating a min bond is required.
      let err = `${t('minimumBond', {
        minBondUnit: minBondUnit.toString(),
        unit,
      })} `;
      // append the subject to the error message.
      if (bondFor === 'nominator') {
        err += t('whenActivelyNominating');
      } else if (isDepositor()) {
        err += t('asThePoolDepositor');
      } else {
        err += t('asAPoolMember');
      }
      newErrors.push(err);
    }

    listenIsValid(!newErrors.length && bond.bond !== '', newErrors);
    setErrors(newErrors);
  };

  return (
    <>
      {errors.map((err, i) => (
        <Warning key={`unbond_error_${i}`} text={err} />
      ))}
      <Spacer />
      <UnbondInput
        active={active}
        defaultValue={defaultValue}
        disabled={
          active.isZero() || nominatorActiveBelowMin || poolActiveBelowMin
        }
        unbondToMin={unbondToMin}
        setters={setters}
        value={bond.bond}
      />
    </>
  );
};
