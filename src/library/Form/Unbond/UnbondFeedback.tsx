// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Warning } from '../Warning';
import { Spacer } from '../Wrappers';
import type { UnbondFeedbackProps } from '../types';
import { UnbondInput } from './UnbondInput';
import { useApi } from 'contexts/Api';
import { planckToUnitBn } from 'library/Utils';

export const UnbondFeedback = ({
  bondFor,
  inSetup = false,
  setters = [],
  listenIsValid,
  defaultBond,
  setLocalResize,
  parentErrors = [],
  txFees,
  displayFirstWarningOnly = true,
}: UnbondFeedbackProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { isDepositor } = useActivePool();
  const { activeAccount } = useActiveAccounts();
  const { getTransferOptions } = useTransferOptions();
  const {
    poolsConfig: { minJoinBond, minCreateBond },
    stakingMetrics: { minNominatorBond },
  } = useApi();
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

  // handler to set bond as a string
  const handleSetBond = (newBond: { bond: BigNumber }) => {
    setBond({ bond: newBond.bond.toString() });
  };

  // current bond value BigNumber
  const bondBn = new BigNumber(
    unitToPlanck(String(bond.bond), units).toString()
  );

  // add this component's setBond to setters
  setters.push(handleSetBond);

  // bond amount to minimum threshold
  const minBondBn =
    bondFor === 'pool'
      ? inSetup || isDepositor()
        ? minCreateBond
        : minJoinBond
      : minNominatorBond;
  const minBondUnit = planckToUnitBn(minBondBn, units);

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
    !active.isZero() &&
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
      newErrors.push(`${t('bondAmountDecimals', { units })}`);
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

    if (listenIsValid && typeof listenIsValid === 'function') {
      listenIsValid(!newErrors.length && bond.bond !== '', newErrors);
    }
    setErrors(newErrors);
  };

  // If `displayFirstWarningOnly` is set, filter errors to only the first one.
  const filteredErrors =
    displayFirstWarningOnly && errors.length > 1 ? [errors[0]] : errors;

  // update bond on account change
  useEffect(() => {
    setBond({ bond: defaultValue });
  }, [activeAccount]);

  // handle errors on input change
  useEffect(() => {
    handleErrors();
  }, [bond, txFees]);

  // if resize is present, handle on error change
  useEffect(() => {
    if (setLocalResize) {
      setLocalResize();
    }
  }, [errors]);

  return (
    <>
      {filteredErrors.map((err, i) => (
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
