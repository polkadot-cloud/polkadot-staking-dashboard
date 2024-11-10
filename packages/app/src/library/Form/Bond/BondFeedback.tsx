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
import type { BondFeedbackProps } from '../types';
import { BondInput } from './BondInput';
import { useApi } from 'contexts/Api';
import { planckToUnitBn } from 'library/Utils';

export const BondFeedback = ({
  bondFor,
  inSetup = false,
  joiningPool = false,
  parentErrors = [],
  setters = [],
  listenIsValid,
  disableTxFeeUpdate = false,
  defaultBond,
  txFees,
  maxWidth,
  syncing = false,
  displayFirstWarningOnly = true,
}: BondFeedbackProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { isDepositor } = useActivePool();
  const { activeAccount } = useActiveAccounts();
  const {
    poolsConfig: { minJoinBond, minCreateBond },
    stakingMetrics: { minNominatorBond },
  } = useApi();
  const { getTransferOptions } = useTransferOptions();
  const allTransferOptions = getTransferOptions(activeAccount);

  const defaultBondStr = defaultBond ? String(defaultBond) : '';

  // get bond options for either staking or pooling.
  const availableBalance =
    bondFor === 'nominator'
      ? allTransferOptions.nominate.totalAdditionalBond
      : allTransferOptions.transferrableBalance;

  // the default bond balance. If we are bonding, subtract tx fees from bond amount.
  const freeToBond = !disableTxFeeUpdate
    ? BigNumber.max(availableBalance.minus(txFees), 0)
    : availableBalance;

  // store errors
  const [errors, setErrors] = useState<string[]>([]);

  // local bond state
  const [bond, setBond] = useState<{ bond: string }>({
    bond: defaultBondStr,
  });

  // handler to set bond as a string
  const handleSetBond = (newBond: { bond: BigNumber }) => {
    setBond({ bond: newBond.bond.toString() });
  };

  // current bond value BigNumber
  const bondBn = new BigNumber(unitToPlanck(bond.bond, units).toString());

  // whether bond is disabled
  const [bondDisabled, setBondDisabled] = useState<boolean>(false);

  // bond minus tx fees if too much
  const enoughToCoverTxFees = freeToBond.minus(bondBn).isGreaterThan(txFees);

  const bondAfterTxFees = enoughToCoverTxFees
    ? bondBn
    : BigNumber.max(bondBn.minus(txFees), 0);

  // add this component's setBond to setters
  setters.push(handleSetBond);

  // bond amount to minimum threshold.
  const minBondBn =
    bondFor === 'pool'
      ? inSetup || isDepositor()
        ? minCreateBond
        : minJoinBond
      : minNominatorBond;
  const minBondUnit = planckToUnitBn(minBondBn, units);

  // handle error updates
  const handleErrors = () => {
    let disabled = false;
    const newErrors = parentErrors;
    const decimals = bond.bond.toString().split('.')[1]?.length ?? 0;

    // bond errors
    if (freeToBond.isZero()) {
      disabled = true;
      newErrors.push(`${t('noFree', { unit })}`);
    }

    // bond amount must not surpass freeBalalance
    if (bondBn.isGreaterThan(freeToBond)) {
      newErrors.push(t('moreThanBalance'));
    }

    // bond amount must not be smaller than 1 planck
    if (bond.bond !== '' && bondBn.isLessThan(1)) {
      newErrors.push(t('tooSmall'));
    }

    // check bond after transaction fees is still valid
    if (bond.bond !== '' && bondAfterTxFees.isLessThan(0)) {
      newErrors.push(`${t('notEnoughAfter', { unit })}`);
    }

    // cbond amount must not surpass network supported units
    if (decimals > units) {
      newErrors.push(`${t('bondDecimalsError', { units })}`);
    }

    if (inSetup || joiningPool) {
      if (freeToBond.isLessThan(minBondBn)) {
        disabled = true;
        newErrors.push(`${t('notMeet')} ${minBondUnit} ${unit}.`);
      }
      // bond amount must be more than minimum required bond
      if (bond.bond !== '' && bondBn.isLessThan(minBondBn)) {
        newErrors.push(`${t('atLeast')} ${minBondUnit} ${unit}.`);
      }
    }

    const bondValid = !newErrors.length && bond.bond !== '';
    setBondDisabled(disabled);

    if (listenIsValid && typeof listenIsValid === 'function') {
      listenIsValid(bondValid, newErrors);
    }

    setErrors(newErrors);
  };

  // If `displayFirstWarningOnly` is set, filter errors to only the first one.
  const filteredErrors =
    displayFirstWarningOnly && errors.length > 1 ? [errors[0]] : errors;

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
      if (bondBn.isGreaterThan(freeToBond)) {
        setBond({ bond: String(planckToUnitBn(freeToBond, units)) });
      }
    }
  }, [txFees]);

  return (
    <>
      {filteredErrors.map((err, i) => (
        <Warning key={`setup_error_${i}`} text={err} />
      ))}
      <Spacer />
      <div
        style={{
          width: '100%',
          maxWidth: maxWidth ? '500px' : '100%',
        }}
      >
        <BondInput
          value={String(bond.bond)}
          defaultValue={defaultBondStr}
          syncing={syncing}
          disabled={bondDisabled}
          setters={setters}
          freeToBond={planckToUnitBn(freeToBond, units)}
          disableTxFeeUpdate={disableTxFeeUpdate}
        />
      </div>
    </>
  );
};
